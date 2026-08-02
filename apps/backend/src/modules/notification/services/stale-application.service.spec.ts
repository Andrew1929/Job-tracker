import { NotificationType } from '../../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { STALE_SCAN_LOCAL_HOUR } from '../constants/notification.constants';
import { NotificationDeliveryRequest } from '../types/notification.types';
import { NotificationDeliveryService } from './notification-delivery.service';
import { StaleApplicationService } from './stale-application.service';

const USER_ID = 'user-1';

/** Builds an instant that lands on the delivery hour in UTC. */
function atStaleHour(): Date {
  const date = new Date();
  date.setUTCHours(STALE_SCAN_LOCAL_HOUR, 0, 0, 0);
  return date;
}

describe('StaleApplicationService', () => {
  let service: StaleApplicationService;
  let prisma: {
    job: { groupBy: jest.Mock; findMany: jest.Mock };
    notificationPreferences: { findMany: jest.Mock };
    jobActivity: { groupBy: jest.Mock };
    note: { groupBy: jest.Mock };
    interview: { groupBy: jest.Mock };
  };
  let delivery: { deliver: jest.Mock };

  beforeEach(() => {
    prisma = {
      job: { groupBy: jest.fn(), findMany: jest.fn() },
      notificationPreferences: { findMany: jest.fn().mockResolvedValue([]) },
      jobActivity: { groupBy: jest.fn().mockResolvedValue([]) },
      note: { groupBy: jest.fn().mockResolvedValue([]) },
      interview: { groupBy: jest.fn().mockResolvedValue([]) },
    };
    delivery = { deliver: jest.fn().mockResolvedValue(true) };

    service = new StaleApplicationService(
      prisma as unknown as PrismaService,
      delivery as unknown as NotificationDeliveryService,
    );
  });

  it('does nothing when no user has active applications', async () => {
    prisma.job.groupBy.mockResolvedValue([]);

    await service.scan(atStaleHour());

    expect(delivery.deliver).not.toHaveBeenCalled();
  });

  it('notifies once for an application with no activity past the threshold', async () => {
    prisma.job.groupBy.mockResolvedValue([{ userId: USER_ID }]);
    prisma.job.findMany.mockResolvedValueOnce([
      {
        id: 'job-1',
        title: 'Full-stack Developer',
        createdAt: new Date('2020-01-01T00:00:00.000Z'),
        appliedAt: new Date('2020-01-01T00:00:00.000Z'),
        company: { name: 'Spotify' },
      },
    ]);

    await service.scan(atStaleHour());

    expect(delivery.deliver).toHaveBeenCalledTimes(1);
    const [arg] = delivery.deliver.mock.calls[0] as [
      NotificationDeliveryRequest,
    ];
    expect(arg).toMatchObject({
      type: NotificationType.APPLICATION_STALE,
      relatedEntityId: 'job-1',
      actionUrl: '/jobs/job-1',
    });
  });

  it('skips users whose local time is not the delivery hour', async () => {
    prisma.job.groupBy.mockResolvedValue([{ userId: USER_ID }]);
    prisma.notificationPreferences.findMany.mockResolvedValue([
      {
        userId: USER_ID,
        inAppEnabled: true,
        staleApplicationRemindersEnabled: true,
        // Fixed offset zone shifts local hour away from the scan hour.
        timezone: 'Etc/GMT-5',
        staleApplicationThresholdDays: 7,
      },
    ]);

    const offHour = atStaleHour();
    offHour.setUTCHours((STALE_SCAN_LOCAL_HOUR + 1) % 24, 0, 0, 0);

    await service.scan(offHour);

    expect(prisma.job.findMany).not.toHaveBeenCalled();
    expect(delivery.deliver).not.toHaveBeenCalled();
  });

  it('respects a disabled preference', async () => {
    prisma.job.groupBy.mockResolvedValue([{ userId: USER_ID }]);
    prisma.notificationPreferences.findMany.mockResolvedValue([
      {
        userId: USER_ID,
        inAppEnabled: true,
        staleApplicationRemindersEnabled: false,
        timezone: 'UTC',
        staleApplicationThresholdDays: 7,
      },
    ]);

    await service.scan(atStaleHour());

    expect(delivery.deliver).not.toHaveBeenCalled();
  });
});
