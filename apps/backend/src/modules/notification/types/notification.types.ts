import {
  NotificationEntityType,
  NotificationPriority,
  NotificationType,
  Prisma,
} from '../../../../generated/prisma/client';

/** Fields safe to return to the client. Internal columns (dedupeKey, scheduledAt) are omitted. */
export const NOTIFICATION_LIST_SELECT = {
  id: true,
  type: true,
  priority: true,
  title: true,
  message: true,
  actionUrl: true,
  read: true,
  readAt: true,
  relatedEntityType: true,
  relatedEntityId: true,
  createdAt: true,
} satisfies Prisma.NotificationSelect;

export type NotificationListItem = Prisma.NotificationGetPayload<{
  select: typeof NOTIFICATION_LIST_SELECT;
}>;

export interface PaginatedNotifications {
  items: NotificationListItem[];
  total: number;
}

/**
 * Channel-agnostic request that business triggers and the worker hand to the
 * delivery service. The caller describes *what* to notify about; it does not
 * know how any delivery channel persists or transmits the notification.
 */
export interface NotificationDeliveryRequest {
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;
  relatedEntityType?: NotificationEntityType;
  relatedEntityId?: string;
  metadata?: Prisma.InputJsonValue;
  /** Deterministic idempotency key; a duplicate request is silently skipped. */
  dedupeKey: string;
  scheduledAt?: Date;
  expiresAt?: Date;
}
