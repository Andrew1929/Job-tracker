import { NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryNotificationsDto } from '../dto/query-notifications.dto';
import { NotificationsService } from './notifications.service';

const USER_ID = 'user-1';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: {
    $transaction: jest.Mock;
    notification: {
      findMany: jest.Mock;
      count: jest.Mock;
      updateMany: jest.Mock;
      deleteMany: jest.Mock;
      findFirst: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
      notification: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
        updateMany: jest.fn(),
        deleteMany: jest.fn(),
        findFirst: jest.fn(),
      },
    };
    service = new NotificationsService(prisma as unknown as PrismaService);
  });

  const query = (overrides: Partial<QueryNotificationsDto> = {}) =>
    Object.assign(new QueryNotificationsDto(), overrides);

  function findManyArgs(): Prisma.NotificationFindManyArgs {
    const [args] = prisma.notification.findMany.mock.calls[0] as [
      Prisma.NotificationFindManyArgs,
    ];
    return args;
  }

  it('scopes listing to the authenticated user and newest first', async () => {
    await service.findMany(USER_ID, query());

    expect(findManyArgs().where).toEqual({ userId: USER_ID });
    expect(findManyArgs().orderBy).toEqual({ createdAt: 'desc' });
  });

  it('applies the unread-only filter', async () => {
    await service.findMany(USER_ID, query({ unreadOnly: true }));

    expect(findManyArgs().where).toMatchObject({
      userId: USER_ID,
      read: false,
    });
  });

  it('counts only the user unread notifications', async () => {
    prisma.notification.count.mockResolvedValue(3);

    await expect(service.countUnread(USER_ID)).resolves.toBe(3);
    expect(prisma.notification.count).toHaveBeenCalledWith({
      where: { userId: USER_ID, read: false },
    });
  });

  it('marks a notification as read idempotently when already read', async () => {
    prisma.notification.updateMany.mockResolvedValue({ count: 0 });
    prisma.notification.findFirst.mockResolvedValue({ id: 'n-1' });

    await expect(service.markAsRead(USER_ID, 'n-1')).resolves.toBeUndefined();
  });

  it('throws when marking a notification that does not belong to the user', async () => {
    prisma.notification.updateMany.mockResolvedValue({ count: 0 });
    prisma.notification.findFirst.mockResolvedValue(null);

    await expect(service.markAsRead(USER_ID, 'n-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('scopes deletion to the user and throws when nothing was deleted', async () => {
    prisma.notification.deleteMany.mockResolvedValue({ count: 0 });

    await expect(service.remove(USER_ID, 'n-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.notification.deleteMany).toHaveBeenCalledWith({
      where: { id: 'n-1', userId: USER_ID },
    });
  });
});
