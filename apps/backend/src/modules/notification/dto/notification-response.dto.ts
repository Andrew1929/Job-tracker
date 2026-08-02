import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import {
  NotificationEntityType,
  NotificationPriority,
  NotificationType,
} from '../../../../generated/prisma/client';
import { buildPaginationMeta } from '../../../common/utils/pagination.util';
import {
  NotificationListItem,
  PaginatedNotifications,
} from '../types/notification.types';

@Exclude()
export class NotificationResponseDto {
  @Expose()
  id!: string;

  @Expose()
  type!: NotificationType;

  @Expose()
  priority!: NotificationPriority;

  @Expose()
  title!: string;

  @Expose()
  message!: string;

  @Expose()
  actionUrl!: string | null;

  @Expose()
  read!: boolean;

  @Expose()
  readAt!: Date | null;

  @Expose()
  relatedEntityType!: NotificationEntityType | null;

  @Expose()
  relatedEntityId!: string | null;

  @Expose()
  createdAt!: Date;

  static fromEntity(item: NotificationListItem): NotificationResponseDto {
    return plainToInstance(NotificationResponseDto, item);
  }
}

@Exclude()
export class NotificationPaginationMetaDto {
  @Expose()
  page!: number;

  @Expose()
  limit!: number;

  @Expose()
  total!: number;

  @Expose()
  totalPages!: number;

  @Expose()
  hasNextPage!: boolean;

  @Expose()
  hasPreviousPage!: boolean;
}

@Exclude()
export class PaginatedNotificationsResponseDto {
  @Expose()
  @Type(() => NotificationResponseDto)
  items!: NotificationResponseDto[];

  @Expose()
  @Type(() => NotificationPaginationMetaDto)
  meta!: NotificationPaginationMetaDto;

  static create(
    { items, total }: PaginatedNotifications,
    pagination: { page: number; limit: number },
  ): PaginatedNotificationsResponseDto {
    return plainToInstance(PaginatedNotificationsResponseDto, {
      items: items.map((item) => NotificationResponseDto.fromEntity(item)),
      meta: buildPaginationMeta({ ...pagination, total }),
    });
  }
}

@Exclude()
export class UnreadCountResponseDto {
  @Expose()
  count!: number;

  static create(count: number): UnreadCountResponseDto {
    return plainToInstance(UnreadCountResponseDto, { count });
  }
}
