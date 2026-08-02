import { JobStatus } from '../../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationJobName } from '../constants/notification.constants';
import { queueJobId } from '../dedupe/notification-keys';
import { NotificationSchedulerService } from './notification-scheduler.service';

const USER_ID = 'user-1';
const JOB_ID = 'job-1';
const QUEUE_JOB_ID = queueJobId.nextAction(JOB_ID);

describe('NotificationSchedulerService.syncNextActionReminder', () => {
  let service: NotificationSchedulerService;
  let queue: {
    add: jest.Mock;
    remove: jest.Mock;
    upsertJobScheduler: jest.Mock;
  };
  let prisma: { notificationPreferences: { findUnique: jest.Mock } };

  beforeEach(() => {
    queue = {
      add: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
      upsertJobScheduler: jest.fn().mockResolvedValue(undefined),
    };
    prisma = {
      notificationPreferences: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };

    service = new NotificationSchedulerService(
      queue as never,
      prisma as unknown as PrismaService,
    );
  });

  function addCall(): [
    string,
    Record<string, unknown>,
    { jobId: string; delay: number },
  ] {
    return queue.add.mock.calls[0] as [
      string,
      Record<string, unknown>,
      { jobId: string; delay: number },
    ];
  }

  it('schedules a delayed reminder keyed deterministically by the job', async () => {
    const nextActionDate = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await service.syncNextActionReminder({
      id: JOB_ID,
      userId: USER_ID,
      status: JobStatus.APPLIED,
      nextActionDate,
    });

    // Always clears any prior reminder before (re)scheduling.
    expect(queue.remove).toHaveBeenCalledWith(QUEUE_JOB_ID);

    const [name, data, opts] = addCall();
    expect(name).toBe(NotificationJobName.NEXT_ACTION_REMINDER);
    expect(opts.jobId).toBe(QUEUE_JOB_ID);
    // Default 24h lead against a 48h-out date leaves ~24h of delay.
    expect(opts.delay).toBeGreaterThan(23 * 60 * 60 * 1000);
    expect(data).toMatchObject({
      jobId: JOB_ID,
      userId: USER_ID,
      expectedNextActionDate: nextActionDate.toISOString(),
    });
  });

  it('fires immediately when the lead threshold has already passed', async () => {
    const nextActionDate = new Date(Date.now() + 60 * 60 * 1000); // 1h out

    await service.syncNextActionReminder({
      id: JOB_ID,
      userId: USER_ID,
      status: JobStatus.APPLIED,
      nextActionDate,
    });

    expect(addCall()[2].delay).toBe(0);
  });

  it('cancels without scheduling for a terminal status', async () => {
    await service.syncNextActionReminder({
      id: JOB_ID,
      userId: USER_ID,
      status: JobStatus.ACCEPTED,
      nextActionDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
    });

    expect(queue.remove).toHaveBeenCalledWith(QUEUE_JOB_ID);
    expect(queue.add).not.toHaveBeenCalled();
  });

  it('cancels without scheduling when the date is removed', async () => {
    await service.syncNextActionReminder({
      id: JOB_ID,
      userId: USER_ID,
      status: JobStatus.APPLIED,
      nextActionDate: null,
    });

    expect(queue.add).not.toHaveBeenCalled();
  });

  it('carries the new date in the payload after a reschedule', async () => {
    const first = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const second = new Date(Date.now() + 72 * 60 * 60 * 1000);

    await service.syncNextActionReminder({
      id: JOB_ID,
      userId: USER_ID,
      status: JobStatus.APPLIED,
      nextActionDate: first,
    });
    await service.syncNextActionReminder({
      id: JOB_ID,
      userId: USER_ID,
      status: JobStatus.APPLIED,
      nextActionDate: second,
    });

    const lastCall = queue.add.mock.calls[1] as
      | [string, Record<string, unknown>, { jobId: string; delay: number }]
      | undefined;
    expect(lastCall?.[1].expectedNextActionDate).toBe(second.toISOString());
  });
});
