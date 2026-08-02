import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  InterviewStatus,
  JobStatus,
} from '../../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  MINUTES_TO_MS,
  NOTIFICATION_DEFAULTS,
  NOTIFICATION_QUEUE,
  NotificationJobName,
  NotificationSchedulerId,
  RECONCILE_INTERVAL_MS,
  SCAN_BATCH_SIZE,
  STALE_SCAN_CRON,
  TERMINAL_JOB_STATUSES,
  isTerminalJobStatus,
} from '../constants/notification.constants';
import { queueJobId } from '../dedupe/notification-keys';
import {
  InterviewSchedulingInput,
  NextActionSchedulingInput,
  NotificationScheduler,
} from './notification-scheduler';

/**
 * BullMQ-backed {@link NotificationScheduler}. Owns all queue scheduling.
 * Reminders are (re)scheduled after the triggering database write has committed;
 * a queue failure is logged rather than failing the request, because the periodic
 * reconciliation re-creates any missing future reminder. Queue job ids are
 * deterministic, so re-adding an unchanged reminder is a no-op and rescheduling
 * is a remove-then-add.
 */
@Injectable()
export class NotificationSchedulerService
  extends NotificationScheduler
  implements OnModuleInit
{
  private readonly logger = new Logger(NotificationSchedulerService.name);

  constructor(
    @InjectQueue(NOTIFICATION_QUEUE) private readonly queue: Queue,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async onModuleInit(): Promise<void> {
    await this.registerRepeatableJobs();
  }

  // ---- Next-action reminders -------------------------------------------------

  async syncNextActionReminder(job: NextActionSchedulingInput): Promise<void> {
    const jobId = queueJobId.nextAction(job.id);
    await this.removeJob(jobId);

    if (!job.nextActionDate || isTerminalJobStatus(job.status)) {
      this.logger.log(`reminder.cancelled scope=next-action jobId=${job.id}`);
      return;
    }

    const leadMinutes = await this.resolveNextActionLead(job.userId);
    const delay = this.delayUntil(job.nextActionDate, leadMinutes);

    await this.enqueue(NotificationJobName.NEXT_ACTION_REMINDER, jobId, delay, {
      jobId: job.id,
      userId: job.userId,
      expectedNextActionDate: job.nextActionDate.toISOString(),
    });
    this.logger.log(
      `reminder.scheduled scope=next-action jobId=${job.id} delayMs=${delay}`,
    );
  }

  async cancelNextActionReminder(jobId: string): Promise<void> {
    await this.removeJob(queueJobId.nextAction(jobId));
    this.logger.log(`reminder.cancelled scope=next-action jobId=${jobId}`);
  }

  // ---- Interview reminders & follow-up --------------------------------------

  async syncInterview(
    interview: InterviewSchedulingInput,
    previousLeads: number[] = [],
  ): Promise<void> {
    const leads = await this.resolveInterviewLeads(interview.userId);
    await this.cancelInterviewReminders(interview.id, [
      ...leads,
      ...previousLeads,
    ]);
    await this.removeJob(queueJobId.interviewFollowUp(interview.id));

    if (interview.status === InterviewStatus.SCHEDULED) {
      await this.scheduleInterviewReminders(interview, leads);
    }

    if (
      interview.status === InterviewStatus.COMPLETED &&
      interview.completedAt
    ) {
      await this.scheduleInterviewFollowUp(interview);
    }
  }

  async cancelInterviewJobs(
    interviewId: string,
    userId: string,
  ): Promise<void> {
    const leads = await this.resolveInterviewLeads(userId);
    await this.cancelInterviewReminders(interviewId, leads);
    await this.removeJob(queueJobId.interviewFollowUp(interviewId));
    this.logger.log(
      `reminder.cancelled scope=interview interviewId=${interviewId}`,
    );
  }

  /**
   * Cancels every interview reminder/follow-up attached to a job. Used when the
   * parent job is deleted (DB cascades interviews, but queue jobs would linger).
   */
  async cancelInterviewJobsForJob(
    jobId: string,
    userId: string,
  ): Promise<void> {
    const interviews = await this.prisma.interview.findMany({
      where: { jobId, userId },
      select: { id: true },
    });

    for (const interview of interviews) {
      await this.cancelInterviewJobs(interview.id, userId);
    }
  }

  private async scheduleInterviewReminders(
    interview: InterviewSchedulingInput,
    leads: number[],
  ): Promise<void> {
    const now = Date.now();
    if (interview.scheduledAt.getTime() <= now) {
      return;
    }

    for (const leadMinutes of leads) {
      const jobId = queueJobId.interviewReminder(interview.id, leadMinutes);
      const delay = this.delayUntil(interview.scheduledAt, leadMinutes);

      await this.enqueue(NotificationJobName.INTERVIEW_REMINDER, jobId, delay, {
        interviewId: interview.id,
        userId: interview.userId,
        expectedScheduledAt: interview.scheduledAt.toISOString(),
        leadMinutes,
      });
    }
    this.logger.log(
      `reminder.scheduled scope=interview interviewId=${interview.id} leads=${leads.join(',')}`,
    );
  }

  private async scheduleInterviewFollowUp(
    interview: InterviewSchedulingInput,
  ): Promise<void> {
    if (!interview.completedAt) {
      return;
    }

    const delayMinutes = await this.resolveFollowUpDelay(interview.userId);
    const fireAt =
      interview.completedAt.getTime() + delayMinutes * MINUTES_TO_MS;
    const delay = Math.max(0, fireAt - Date.now());

    await this.enqueue(
      NotificationJobName.INTERVIEW_FOLLOW_UP,
      queueJobId.interviewFollowUp(interview.id),
      delay,
      {
        interviewId: interview.id,
        userId: interview.userId,
        expectedCompletedAt: interview.completedAt.toISOString(),
      },
    );
    this.logger.log(
      `reminder.scheduled scope=interview-follow-up interviewId=${interview.id} delayMs=${delay}`,
    );
  }

  private async cancelInterviewReminders(
    interviewId: string,
    leads: number[],
  ): Promise<void> {
    // Always include defaults so a preference change that removes an offset
    // still clears the previously scheduled queue job for that offset.
    const uniqueLeads = new Set<number>([
      ...NOTIFICATION_DEFAULTS.INTERVIEW_LEAD_MINUTES,
      ...leads,
    ]);

    for (const leadMinutes of uniqueLeads) {
      await this.removeJob(
        queueJobId.interviewReminder(interviewId, leadMinutes),
      );
    }
  }

  /**
   * Re-schedules a user's open reminders after preference offsets change.
   * Bounded and idempotent; safe to call from a preferences PATCH.
   */
  async resyncUserReminders(
    userId: string,
    previousInterviewLeads: number[] = [],
  ): Promise<void> {
    const now = new Date();

    const jobs = await this.prisma.job.findMany({
      where: {
        userId,
        nextActionDate: { not: null },
        status: { notIn: [...TERMINAL_JOB_STATUSES] },
      },
      select: { id: true, userId: true, status: true, nextActionDate: true },
      take: SCAN_BATCH_SIZE,
    });

    for (const job of jobs) {
      await this.syncNextActionReminder(job);
    }

    const interviews = await this.prisma.interview.findMany({
      where: {
        userId,
        OR: [
          { status: InterviewStatus.SCHEDULED, scheduledAt: { gte: now } },
          { status: InterviewStatus.COMPLETED, completedAt: { not: null } },
        ],
      },
      select: {
        id: true,
        userId: true,
        status: true,
        scheduledAt: true,
        completedAt: true,
      },
      take: SCAN_BATCH_SIZE,
    });

    for (const interview of interviews) {
      await this.syncInterview(interview, previousInterviewLeads);
    }

    this.logger.log(
      `reminder.rescheduled scope=user-preferences userId=${userId} jobs=${jobs.length} interviews=${interviews.length}`,
    );
  }

  // ---- Reconciliation --------------------------------------------------------

  /**
   * Re-syncs future reminders in bounded batches so that reminders lost to a
   * crash between commit and enqueue are recovered. Idempotent: deterministic
   * job ids mean re-adding an existing reminder changes nothing.
   */
  async reconcile(): Promise<void> {
    const now = new Date();
    let recovered = 0;

    recovered += await this.paginate(
      (skip) =>
        this.prisma.job.findMany({
          where: {
            nextActionDate: { gte: now },
            status: {
              notIn: [
                JobStatus.ACCEPTED,
                JobStatus.REJECTED,
                JobStatus.WITHDRAWN,
              ],
            },
          },
          select: {
            id: true,
            userId: true,
            status: true,
            nextActionDate: true,
          },
          orderBy: { id: 'asc' },
          skip,
          take: SCAN_BATCH_SIZE,
        }),
      (job) => this.syncNextActionReminder(job),
    );

    recovered += await this.paginate(
      (skip) =>
        this.prisma.interview.findMany({
          where: {
            status: InterviewStatus.SCHEDULED,
            scheduledAt: { gte: now },
          },
          select: {
            id: true,
            userId: true,
            status: true,
            scheduledAt: true,
            completedAt: true,
          },
          orderBy: { id: 'asc' },
          skip,
          take: SCAN_BATCH_SIZE,
        }),
      (interview) => this.syncInterview(interview),
    );

    // Recover follow-up reminders for recently completed interviews. Bounded to
    // the follow-up delay window so old completed interviews are not rescanned
    // forever; the worker still skips ones that already have notes/feedback.
    const followUpHorizonMs =
      NOTIFICATION_DEFAULTS.INTERVIEW_FOLLOW_UP_DELAY_MINUTES * MINUTES_TO_MS;
    const completedSince = new Date(now.getTime() - followUpHorizonMs);

    recovered += await this.paginate(
      (skip) =>
        this.prisma.interview.findMany({
          where: {
            status: InterviewStatus.COMPLETED,
            completedAt: { gte: completedSince, lte: now },
          },
          select: {
            id: true,
            userId: true,
            status: true,
            scheduledAt: true,
            completedAt: true,
          },
          orderBy: { id: 'asc' },
          skip,
          take: SCAN_BATCH_SIZE,
        }),
      (interview) => this.syncInterview(interview),
    );

    this.logger.log(`reconciliation.completed entities=${recovered}`);
  }

  private async paginate<T>(
    fetchPage: (skip: number) => Promise<T[]>,
    handle: (item: T) => Promise<void>,
  ): Promise<number> {
    let skip = 0;
    let processed = 0;

    for (;;) {
      const page = await fetchPage(skip);
      if (page.length === 0) {
        break;
      }

      for (const item of page) {
        await handle(item);
      }

      processed += page.length;
      if (page.length < SCAN_BATCH_SIZE) {
        break;
      }
      skip += SCAN_BATCH_SIZE;
    }

    return processed;
  }

  // ---- Queue primitives & preference resolution -----------------------------

  private delayUntil(target: Date, leadMinutes: number): number {
    const fireAt = target.getTime() - leadMinutes * MINUTES_TO_MS;
    return Math.max(0, fireAt - Date.now());
  }

  private async enqueue(
    name: NotificationJobName,
    jobId: string,
    delay: number,
    data: Record<string, unknown>,
  ): Promise<void> {
    try {
      await this.queue.add(name, data, { jobId, delay });
    } catch (error) {
      this.logger.error(
        `reminder.schedule_failed name=${name} jobId=${jobId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private async removeJob(jobId: string): Promise<void> {
    try {
      await this.queue.remove(jobId);
    } catch {
      // A missing or locked job is safe to ignore; reconciliation self-heals.
    }
  }

  private async registerRepeatableJobs(): Promise<void> {
    try {
      await this.queue.upsertJobScheduler(
        NotificationSchedulerId.STALE_APPLICATION_SCAN,
        { pattern: STALE_SCAN_CRON },
        { name: NotificationJobName.STALE_APPLICATION_SCAN },
      );
      await this.queue.upsertJobScheduler(
        NotificationSchedulerId.RECONCILE,
        { every: RECONCILE_INTERVAL_MS },
        { name: NotificationJobName.RECONCILE },
      );
    } catch (error) {
      this.logger.error(
        'reminder.scheduler_registration_failed',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private async resolveNextActionLead(userId: string): Promise<number> {
    const prefs = await this.prisma.notificationPreferences.findUnique({
      where: { userId },
      select: { nextActionReminderLeadMinutes: true },
    });
    return (
      prefs?.nextActionReminderLeadMinutes ??
      NOTIFICATION_DEFAULTS.NEXT_ACTION_LEAD_MINUTES
    );
  }

  private async resolveInterviewLeads(userId: string): Promise<number[]> {
    const prefs = await this.prisma.notificationPreferences.findUnique({
      where: { userId },
      select: { interviewReminderLeadMinutes: true },
    });
    const leads = prefs?.interviewReminderLeadMinutes;
    return leads && leads.length > 0
      ? leads
      : [...NOTIFICATION_DEFAULTS.INTERVIEW_LEAD_MINUTES];
  }

  private async resolveFollowUpDelay(userId: string): Promise<number> {
    const prefs = await this.prisma.notificationPreferences.findUnique({
      where: { userId },
      select: { interviewFollowUpDelayMinutes: true },
    });
    return (
      prefs?.interviewFollowUpDelayMinutes ??
      NOTIFICATION_DEFAULTS.INTERVIEW_FOLLOW_UP_DELAY_MINUTES
    );
  }
}
