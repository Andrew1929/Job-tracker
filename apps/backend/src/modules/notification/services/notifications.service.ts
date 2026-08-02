import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryNotificationsDto } from '../dto/query-notifications.dto';
import {
  NOTIFICATION_LIST_SELECT,
  PaginatedNotifications,
} from '../types/notification.types';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    userId: string,
    query: QueryNotificationsDto,
  ): Promise<PaginatedNotifications> {
    const where = this.buildWhere(userId, query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where,
        select: NOTIFICATION_LIST_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { items, total };
  }

  /** Efficient indexed count of unread notifications for the user. */
  countUnread(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, read: false },
    });
  }

  /** Idempotent: marking an already-read notification is a no-op success. */
  async markAsRead(userId: string, id: string): Promise<void> {
    const { count } = await this.prisma.notification.updateMany({
      where: { id, userId, read: false },
      data: { read: true, readAt: new Date() },
    });

    if (count === 0) {
      await this.assertExists(userId, id);
    }
  }

  async markAllAsRead(userId: string): Promise<number> {
    const { count } = await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: new Date() },
    });

    return count;
  }

  async remove(userId: string, id: string): Promise<void> {
    const { count } = await this.prisma.notification.deleteMany({
      where: { id, userId },
    });

    if (count === 0) {
      throw new NotFoundException('Notification not found');
    }
  }

  private async assertExists(userId: string, id: string): Promise<void> {
    const existing = await this.prisma.notification.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Notification not found');
    }
  }

  private buildWhere(
    userId: string,
    query: QueryNotificationsDto,
  ): Prisma.NotificationWhereInput {
    return {
      userId,
      ...(query.unreadOnly && { read: false }),
      ...(query.type && { type: query.type }),
    };
  }
}
