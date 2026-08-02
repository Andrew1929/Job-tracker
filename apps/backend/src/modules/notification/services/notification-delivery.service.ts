import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationDeliveryRequest } from '../types/notification.types';

const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

/**
 * Delivery orchestration. Business triggers request a notification without
 * knowing how it is delivered; today the only channel is in-app persistence.
 * New channels (email, web push) can be added here without touching the
 * scheduling or trigger logic.
 *
 * Creation is idempotent via the unique `dedupeKey`: a duplicate request (worker
 * retry, manual queue recreation, reconciliation) is detected and skipped.
 */
@Injectable()
export class NotificationDeliveryService {
  private readonly logger = new Logger(NotificationDeliveryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async deliver(request: NotificationDeliveryRequest): Promise<boolean> {
    try {
      const created = await this.prisma.notification.create({
        data: {
          userId: request.userId,
          type: request.type,
          priority: request.priority,
          title: request.title,
          message: request.message,
          actionUrl: request.actionUrl,
          relatedEntityType: request.relatedEntityType,
          relatedEntityId: request.relatedEntityId,
          metadata: request.metadata,
          dedupeKey: request.dedupeKey,
          scheduledAt: request.scheduledAt,
          expiresAt: request.expiresAt,
        },
        select: { id: true },
      });

      this.logger.log(
        `notification.created id=${created.id} type=${request.type} userId=${request.userId}`,
      );
      return true;
    } catch (error) {
      if (this.isDuplicate(error)) {
        this.logger.log(
          `notification.duplicate_prevented type=${request.type} userId=${request.userId}`,
        );
        return false;
      }
      throw error;
    }
  }

  private isDuplicate(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === UNIQUE_CONSTRAINT_VIOLATION
    );
  }
}
