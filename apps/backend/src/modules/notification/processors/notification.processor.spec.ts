import {
  InterviewResult,
  InterviewStatus,
  InterviewType,
  JobStatus,
  NotificationType,
} from '../../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationJobName } from '../constants/notification.constants';
import { NotificationDeliveryService } from '../services/notification-delivery.service';
import { NotificationSchedulerService } from '../services/notification-scheduler.service';
import { StaleApplicationService } from '../services/stale-application.service';
import { NotificationDeliveryRequest } from '../types/notification.types';
import { NotificationProcessor } from './notification.processor';

const USER_ID = 'user-1';

describe('NotificationProcessor', () => {
  let processor: NotificationProcessor;
  let prisma: {
    job: { findUnique: jest.Mock };
    interview: { findUnique: jest.Mock };
    notificationPreferences: { findUnique: jest.Mock };
  };
  let delivery: { deliver: jest.Mock };

  beforeEach(() => {
    prisma = {
      job: { findUnique: jest.fn() },
      interview: { findUnique: jest.fn() },
      notificationPreferences: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };
    delivery = { deliver: jest.fn().mockResolvedValue(true) };

    processor = new NotificationProcessor(
      prisma as unknown as PrismaService,
      delivery as unknown as NotificationDeliveryService,
      {} as StaleApplicationService,
      {} as NotificationSchedulerService,
    );
  });

  const runNextAction = (data: unknown) =>
    processor.process({
      name: NotificationJobName.NEXT_ACTION_REMINDER,
      data,
    } as never);

  const deliverArg = (): NotificationDeliveryRequest => {
    const [arg] = delivery.deliver.mock.calls[0] as [
      NotificationDeliveryRequest,
    ];
    return arg;
  };

  describe('next-action reminder', () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    it('skips a deleted job without delivering', async () => {
      prisma.job.findUnique.mockResolvedValue(null);

      await runNextAction({
        jobId: 'job-1',
        userId: USER_ID,
        expectedNextActionDate: futureDate.toISOString(),
      });

      expect(delivery.deliver).not.toHaveBeenCalled();
    });

    it('skips an outdated queue job whose date no longer matches', async () => {
      prisma.job.findUnique.mockResolvedValue({
        id: 'job-1',
        userId: USER_ID,
        status: JobStatus.APPLIED,
        nextActionDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
        title: 'Engineer',
        company: { name: 'Spotify' },
      });

      await runNextAction({
        jobId: 'job-1',
        userId: USER_ID,
        expectedNextActionDate: futureDate.toISOString(),
      });

      expect(delivery.deliver).not.toHaveBeenCalled();
    });

    it('skips a job in a terminal status', async () => {
      prisma.job.findUnique.mockResolvedValue({
        id: 'job-1',
        userId: USER_ID,
        status: JobStatus.REJECTED,
        nextActionDate: futureDate,
        title: 'Engineer',
        company: { name: 'Spotify' },
      });

      await runNextAction({
        jobId: 'job-1',
        userId: USER_ID,
        expectedNextActionDate: futureDate.toISOString(),
      });

      expect(delivery.deliver).not.toHaveBeenCalled();
    });

    it('delivers an upcoming reminder for a future date', async () => {
      prisma.job.findUnique.mockResolvedValue({
        id: 'job-1',
        userId: USER_ID,
        status: JobStatus.APPLIED,
        nextActionDate: futureDate,
        title: 'Full-stack Developer',
        company: { name: 'Spotify' },
      });

      await runNextAction({
        jobId: 'job-1',
        userId: USER_ID,
        expectedNextActionDate: futureDate.toISOString(),
      });

      expect(delivery.deliver).toHaveBeenCalledTimes(1);
      expect(deliverArg()).toMatchObject({
        type: NotificationType.NEXT_ACTION_REMINDER,
        userId: USER_ID,
        actionUrl: '/jobs/job-1',
      });
    });

    it('delivers an overdue notification for a past date', async () => {
      const pastDate = new Date(Date.now() - 60 * 60 * 1000);
      prisma.job.findUnique.mockResolvedValue({
        id: 'job-1',
        userId: USER_ID,
        status: JobStatus.APPLIED,
        nextActionDate: pastDate,
        title: 'Full-stack Developer',
        company: { name: 'Spotify' },
      });

      await runNextAction({
        jobId: 'job-1',
        userId: USER_ID,
        expectedNextActionDate: pastDate.toISOString(),
      });

      expect(deliverArg()).toMatchObject({
        type: NotificationType.NEXT_ACTION_OVERDUE,
      });
    });
  });

  describe('interview reminder', () => {
    const scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const baseInterview = {
      id: 'interview-1',
      userId: USER_ID,
      status: InterviewStatus.SCHEDULED,
      scheduledAt,
      type: InterviewType.TECHNICAL,
      job: { title: 'Full-stack Developer', company: { name: 'Spotify' } },
    };

    const run = (leadMinutes: number) =>
      processor.process({
        name: NotificationJobName.INTERVIEW_REMINDER,
        data: {
          interviewId: 'interview-1',
          userId: USER_ID,
          expectedScheduledAt: scheduledAt.toISOString(),
          leadMinutes,
        },
      } as never);

    it('delivers the 24-hour reminder', async () => {
      prisma.interview.findUnique.mockResolvedValue(baseInterview);

      await run(1440);

      expect(deliverArg()).toMatchObject({
        type: NotificationType.INTERVIEW_REMINDER,
        actionUrl: '/calendar',
      });
      expect(deliverArg().dedupeKey).toContain('1440m');
    });

    it('delivers the 2-hour reminder', async () => {
      prisma.interview.findUnique.mockResolvedValue(baseInterview);

      await run(120);

      expect(deliverArg().dedupeKey).toContain('120m');
    });

    it('skips a cancelled interview', async () => {
      prisma.interview.findUnique.mockResolvedValue({
        ...baseInterview,
        status: InterviewStatus.CANCELLED,
      });

      await run(1440);

      expect(delivery.deliver).not.toHaveBeenCalled();
    });
  });

  describe('interview follow-up', () => {
    const completedAt = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const run = () =>
      processor.process({
        name: NotificationJobName.INTERVIEW_FOLLOW_UP,
        data: {
          interviewId: 'interview-1',
          userId: USER_ID,
          expectedCompletedAt: completedAt.toISOString(),
        },
      } as never);

    const completedInterview = (overrides: Record<string, unknown>) => ({
      id: 'interview-1',
      userId: USER_ID,
      status: InterviewStatus.COMPLETED,
      scheduledAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
      completedAt,
      type: InterviewType.TECHNICAL,
      feedback: null,
      result: InterviewResult.PENDING,
      job: { title: 'Full-stack Developer', company: { name: 'Spotify' } },
      ...overrides,
    });

    it('delivers a follow-up when notes are still missing', async () => {
      prisma.interview.findUnique.mockResolvedValue(completedInterview({}));

      await run();

      expect(deliverArg()).toMatchObject({
        type: NotificationType.INTERVIEW_FOLLOW_UP,
      });
    });

    it('skips the follow-up once feedback and a result are recorded', async () => {
      prisma.interview.findUnique.mockResolvedValue(
        completedInterview({
          feedback: 'Went well',
          result: InterviewResult.PASSED,
        }),
      );

      await run();

      expect(delivery.deliver).not.toHaveBeenCalled();
    });
  });
});
