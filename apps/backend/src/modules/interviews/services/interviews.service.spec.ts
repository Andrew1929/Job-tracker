import { NotFoundException } from '@nestjs/common';
import {
  InterviewStatus,
  InterviewType,
} from '../../../../generated/prisma/client';
import { NotificationSchedulerService } from '../../notification/services/notification-scheduler.service';
import { PrismaService } from '../../prisma/prisma.service';
import { InterviewsService } from './interviews.service';

const USER_ID = 'user-1';
const JOB_ID = 'job-1';

describe('InterviewsService', () => {
  let service: InterviewsService;
  let tx: {
    job: { findFirst: jest.Mock };
    interview: { findFirst: jest.Mock; create: jest.Mock; update: jest.Mock };
  };
  let prisma: {
    $transaction: jest.Mock;
    interview: { deleteMany: jest.Mock };
  };
  let scheduler: {
    syncInterview: jest.Mock;
    cancelInterviewJobs: jest.Mock;
  };

  beforeEach(() => {
    tx = {
      job: { findFirst: jest.fn() },
      interview: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
    };
    prisma = {
      $transaction: jest.fn((cb: (client: typeof tx) => unknown) => cb(tx)),
      interview: { deleteMany: jest.fn() },
    };
    scheduler = {
      syncInterview: jest.fn().mockResolvedValue(undefined),
      cancelInterviewJobs: jest.fn().mockResolvedValue(undefined),
    };

    service = new InterviewsService(
      prisma as unknown as PrismaService,
      scheduler as unknown as NotificationSchedulerService,
    );
  });

  const scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  it('rejects creating an interview on a job the user does not own', async () => {
    tx.job.findFirst.mockResolvedValue(null);

    await expect(
      service.create(USER_ID, {
        jobId: JOB_ID,
        type: InterviewType.TECHNICAL,
        scheduledAt,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(tx.interview.create).not.toHaveBeenCalled();
    expect(scheduler.syncInterview).not.toHaveBeenCalled();
  });

  it('schedules reminders after creating an interview', async () => {
    tx.job.findFirst.mockResolvedValue({ id: JOB_ID });
    tx.interview.create.mockResolvedValue({
      id: 'interview-1',
      status: InterviewStatus.SCHEDULED,
      scheduledAt,
      completedAt: null,
    });

    await service.create(USER_ID, {
      jobId: JOB_ID,
      type: InterviewType.TECHNICAL,
      scheduledAt,
    });

    expect(scheduler.syncInterview).toHaveBeenCalledWith({
      id: 'interview-1',
      userId: USER_ID,
      status: InterviewStatus.SCHEDULED,
      scheduledAt,
      completedAt: null,
    });
  });

  it('does not re-sync reminders when only unrelated fields change', async () => {
    tx.interview.findFirst.mockResolvedValue({
      id: 'interview-1',
      status: InterviewStatus.SCHEDULED,
      scheduledAt,
      completedAt: null,
    });
    tx.interview.update.mockResolvedValue({
      id: 'interview-1',
      status: InterviewStatus.SCHEDULED,
      scheduledAt,
      completedAt: null,
    });

    await service.update(USER_ID, 'interview-1', { feedback: 'Solid answers' });

    expect(scheduler.syncInterview).not.toHaveBeenCalled();
  });

  it('cancels queued jobs when an interview is deleted', async () => {
    prisma.interview.deleteMany.mockResolvedValue({ count: 1 });

    await service.remove(USER_ID, 'interview-1');

    expect(scheduler.cancelInterviewJobs).toHaveBeenCalledWith(
      'interview-1',
      USER_ID,
    );
  });
});
