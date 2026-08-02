import {
  NotificationPriority,
  NotificationType,
  Prisma,
} from '../../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationDeliveryService } from './notification-delivery.service';

describe('NotificationDeliveryService', () => {
  let service: NotificationDeliveryService;
  let create: jest.Mock;

  beforeEach(() => {
    create = jest.fn();
    service = new NotificationDeliveryService({
      notification: { create },
    } as unknown as PrismaService);
  });

  const request = {
    userId: 'user-1',
    type: NotificationType.NEXT_ACTION_REMINDER,
    priority: NotificationPriority.NORMAL,
    title: 'Next action tomorrow',
    message: 'Follow up.',
    dedupeKey: 'next-action:job-1:2026-08-10:1440m',
  };

  it('persists a notification and reports success', async () => {
    create.mockResolvedValue({ id: 'notif-1' });

    await expect(service.deliver(request)).resolves.toBe(true);
    expect(create).toHaveBeenCalledTimes(1);
  });

  it('treats a duplicate dedupeKey as a prevented duplicate, not an error', async () => {
    create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('duplicate', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    await expect(service.deliver(request)).resolves.toBe(false);
  });

  it('propagates unexpected persistence errors for retry', async () => {
    create.mockRejectedValue(new Error('connection lost'));

    await expect(service.deliver(request)).rejects.toThrow('connection lost');
  });
});
