import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  InterviewResult,
  InterviewStatus,
  NotificationEntityType,
  NotificationPriority,
  NotificationType,
} from '../../../../generated/prisma/client';
import { resolveTimeZone } from '../../../common/utils/timezone.util';
import { PrismaService } from '../../prisma/prisma.service';
import {
  NOTIFICATION_DEFAULTS,
  NOTIFICATION_QUEUE,
  NotificationJobName,
  isTerminalJobStatus,
} from '../constants/notification.constants';
import {
  InterviewContentInput,
  buildInterviewFollowUpContent,
  buildInterviewReminderContent,
  buildNextActionOverdueContent,
  buildNextActionUpcomingContent,
} from '../content/notification-content.builder';
import { dedupeKey } from '../dedupe/notification-keys';
import {
  InterviewFollowUpJobData,
  InterviewReminderJobData,
  NextActionReminderJobData,
} from '../queue/notification-job.types';
import { NotificationDeliveryService } from '../services/notification-delivery.service';
import { StaleApplicationService } from '../services/stale-application.service';
import { NotificationSchedulerService } from '../services/notification-scheduler.service';

interface EffectivePrefs {
  inAppEnabled: boolean;
  nextActionRemindersEnabled: boolean;
  interviewRemindersEnabled: boolean;
  interviewFollowUpsEnabled: boolean;
  nextActionReminderLeadMinutes: number;
  timezone: string;
}

/**
 * Single worker for the notifications queue. Every handler reloads the current
 * source entity and re-validates the trigger conditions, never trusting the
 * (possibly stale) payload. Conditions that make a reminder no longer relevant
 * result in a silent no-op (return), not a thrown error, so they are not
 * retried. Only unexpected infrastructure errors propagate for retry.
 */
@Processor(NOTIFICATION_QUEUE)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly delivery: NotificationDeliveryService,
    private readonly staleApplications: StaleApplicationService,
    private readonly scheduler: NotificationSchedulerService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case NotificationJobName.NEXT_ACTION_REMINDER:
        return this.handleNextAction(job.data as NextActionReminderJobData);
      case NotificationJobName.INTERVIEW_REMINDER:
        return this.handleInterviewReminder(
          job.data as InterviewReminderJobData,
        );
      case NotificationJobName.INTERVIEW_FOLLOW_UP:
        return this.handleInterviewFollowUp(
          job.data as InterviewFollowUpJobData,
        );
      case NotificationJobName.STALE_APPLICATION_SCAN:
        return this.staleApplications.scan();
      case NotificationJobName.RECONCILE:
        return this.scheduler.reconcile();
      default:
        this.logger.warn(`worker.unknown_job name=${job.name}`);
    }
  }

  private async handleNextAction(
    data: NextActionReminderJobData,
  ): Promise<void> {
    const job = await this.prisma.job.findUnique({
      where: { id: data.jobId },
      select: {
        id: true,
        userId: true,
        status: true,
        nextActionDate: true,
        title: true,
        company: { select: { name: true } },
      },
    });

    if (
      !job ||
      job.userId !== data.userId ||
      !job.nextActionDate ||
      job.nextActionDate.toISOString() !== data.expectedNextActionDate ||
      isTerminalJobStatus(job.status)
    ) {
      this.logSkip('next-action', data.jobId);
      return;
    }

    const prefs = await this.resolvePrefs(job.userId);
    if (!prefs.inAppEnabled || !prefs.nextActionRemindersEnabled) {
      this.logSkip('next-action-disabled', data.jobId);
      return;
    }

    const now = new Date();
    const jobContent = {
      id: job.id,
      title: job.title,
      companyName: job.company?.name ?? null,
    };
    const isOverdue = now.getTime() >= job.nextActionDate.getTime();

    await this.delivery.deliver({
      userId: job.userId,
      type: isOverdue
        ? NotificationType.NEXT_ACTION_OVERDUE
        : NotificationType.NEXT_ACTION_REMINDER,
      priority: isOverdue
        ? NotificationPriority.HIGH
        : NotificationPriority.NORMAL,
      ...(isOverdue
        ? buildNextActionOverdueContent(jobContent)
        : buildNextActionUpcomingContent(
            jobContent,
            job.nextActionDate,
            now,
            prefs.timezone,
          )),
      relatedEntityType: NotificationEntityType.JOB,
      relatedEntityId: job.id,
      dedupeKey: isOverdue
        ? dedupeKey.nextActionOverdue(job.id, job.nextActionDate)
        : dedupeKey.nextActionUpcoming(
            job.id,
            job.nextActionDate,
            prefs.nextActionReminderLeadMinutes,
          ),
    });
  }

  private async handleInterviewReminder(
    data: InterviewReminderJobData,
  ): Promise<void> {
    const interview = await this.prisma.interview.findUnique({
      where: { id: data.interviewId },
      select: {
        id: true,
        userId: true,
        status: true,
        scheduledAt: true,
        type: true,
        job: { select: { title: true, company: { select: { name: true } } } },
      },
    });

    const now = new Date();
    if (
      !interview ||
      interview.userId !== data.userId ||
      interview.scheduledAt.toISOString() !== data.expectedScheduledAt ||
      interview.status !== InterviewStatus.SCHEDULED ||
      now.getTime() >= interview.scheduledAt.getTime()
    ) {
      this.logSkip('interview-reminder', data.interviewId);
      return;
    }

    const prefs = await this.resolvePrefs(interview.userId);
    if (!prefs.inAppEnabled || !prefs.interviewRemindersEnabled) {
      this.logSkip('interview-reminder-disabled', data.interviewId);
      return;
    }

    const content = buildInterviewReminderContent(
      this.toInterviewContent(interview),
      data.leadMinutes,
      now,
      prefs.timezone,
    );

    await this.delivery.deliver({
      userId: interview.userId,
      type: NotificationType.INTERVIEW_REMINDER,
      priority: NotificationPriority.HIGH,
      ...content,
      relatedEntityType: NotificationEntityType.INTERVIEW,
      relatedEntityId: interview.id,
      dedupeKey: dedupeKey.interviewReminder(
        interview.id,
        interview.scheduledAt,
        data.leadMinutes,
      ),
    });
  }

  private async handleInterviewFollowUp(
    data: InterviewFollowUpJobData,
  ): Promise<void> {
    const interview = await this.prisma.interview.findUnique({
      where: { id: data.interviewId },
      select: {
        id: true,
        userId: true,
        status: true,
        scheduledAt: true,
        completedAt: true,
        type: true,
        feedback: true,
        result: true,
        job: { select: { title: true, company: { select: { name: true } } } },
      },
    });

    if (
      !interview ||
      interview.userId !== data.userId ||
      interview.status !== InterviewStatus.COMPLETED ||
      !interview.completedAt ||
      interview.completedAt.toISOString() !== data.expectedCompletedAt
    ) {
      this.logSkip('interview-follow-up', data.interviewId);
      return;
    }

    if (this.followUpAlreadySatisfied(interview.feedback, interview.result)) {
      this.logSkip('interview-follow-up-satisfied', data.interviewId);
      return;
    }

    const prefs = await this.resolvePrefs(interview.userId);
    if (!prefs.inAppEnabled || !prefs.interviewFollowUpsEnabled) {
      this.logSkip('interview-follow-up-disabled', data.interviewId);
      return;
    }

    await this.delivery.deliver({
      userId: interview.userId,
      type: NotificationType.INTERVIEW_FOLLOW_UP,
      priority: NotificationPriority.NORMAL,
      ...buildInterviewFollowUpContent(this.toInterviewContent(interview)),
      relatedEntityType: NotificationEntityType.INTERVIEW,
      relatedEntityId: interview.id,
      dedupeKey: dedupeKey.interviewFollowUp(
        interview.id,
        interview.completedAt,
      ),
    });
  }

  /** The reminder is no longer useful once both feedback and a result exist. */
  private followUpAlreadySatisfied(
    feedback: string | null,
    result: InterviewResult,
  ): boolean {
    const hasFeedback = feedback !== null && feedback.trim().length > 0;
    return hasFeedback && result !== InterviewResult.PENDING;
  }

  private toInterviewContent(interview: {
    id: string;
    type: InterviewContentInput['type'];
    scheduledAt: Date;
    job: { title: string; company: { name: string } | null };
  }): InterviewContentInput {
    return {
      id: interview.id,
      type: interview.type,
      scheduledAt: interview.scheduledAt,
      jobTitle: interview.job.title,
      companyName: interview.job.company?.name ?? null,
    };
  }

  private async resolvePrefs(userId: string): Promise<EffectivePrefs> {
    const prefs = await this.prisma.notificationPreferences.findUnique({
      where: { userId },
      select: {
        inAppEnabled: true,
        nextActionRemindersEnabled: true,
        interviewRemindersEnabled: true,
        interviewFollowUpsEnabled: true,
        nextActionReminderLeadMinutes: true,
        timezone: true,
      },
    });

    return {
      inAppEnabled: prefs?.inAppEnabled ?? true,
      nextActionRemindersEnabled: prefs?.nextActionRemindersEnabled ?? true,
      interviewRemindersEnabled: prefs?.interviewRemindersEnabled ?? true,
      interviewFollowUpsEnabled: prefs?.interviewFollowUpsEnabled ?? true,
      nextActionReminderLeadMinutes:
        prefs?.nextActionReminderLeadMinutes ??
        NOTIFICATION_DEFAULTS.NEXT_ACTION_LEAD_MINUTES,
      timezone: resolveTimeZone(prefs?.timezone),
    };
  }

  private logSkip(scope: string, entityId: string): void {
    this.logger.log(`worker.stale_skipped scope=${scope} entityId=${entityId}`);
  }
}
