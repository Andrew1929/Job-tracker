import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { MIN_REDIS_VERSION } from '../queue/notification-queue.config';
import { NotificationScheduler } from './notification-scheduler';

/**
 * Used when the notification queue capability is disabled. Every scheduling call
 * returns safely without touching BullMQ, so Jobs/Interviews/preferences keep
 * working; only delayed reminders are unavailable. A single startup warning is
 * emitted (not one log per call) to avoid noise on every job update.
 */
@Injectable()
export class DisabledNotificationScheduler
  extends NotificationScheduler
  implements OnApplicationBootstrap
{
  private readonly logger = new Logger(DisabledNotificationScheduler.name);

  onApplicationBootstrap(): void {
    this.logger.warn(
      `BullMQ notification scheduling is disabled because the notification queue ` +
        `capability is off (set NOTIFICATION_QUEUE_ENABLED=true with a Redis ` +
        `server >= ${MIN_REDIS_VERSION} to enable it). The rest of the ` +
        `application will continue normally.`,
    );
  }

  async syncNextActionReminder(): Promise<void> {}

  async cancelNextActionReminder(): Promise<void> {}

  async syncInterview(): Promise<void> {}

  async cancelInterviewJobs(): Promise<void> {}

  async cancelInterviewJobsForJob(): Promise<void> {}

  async resyncUserReminders(): Promise<void> {}

  async reconcile(): Promise<void> {}
}
