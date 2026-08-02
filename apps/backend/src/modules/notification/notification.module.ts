import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REDIS_CONFIG_KEY, RedisConfig } from '../../config/redis.config';
import { NOTIFICATION_QUEUE } from './constants/notification.constants';
import { NotificationPreferencesController } from './controllers/notification-preferences.controller';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationProcessor } from './processors/notification.processor';
import { isNotificationQueueEnabled } from './queue/notification-queue.config';
import { redisUrlToConnection } from './queue/redis-connection';
import { DisabledNotificationScheduler } from './services/disabled-notification-scheduler';
import { NotificationDeliveryService } from './services/notification-delivery.service';
import { NotificationPreferencesService } from './services/notification-preferences.service';
import { NotificationScheduler } from './services/notification-scheduler';
import { NotificationSchedulerService } from './services/notification-scheduler.service';
import { NotificationsService } from './services/notifications.service';
import { StaleApplicationService } from './services/stale-application.service';

const ONE_HOUR_SECONDS = 60 * 60;
const ONE_DAY_SECONDS = 24 * ONE_HOUR_SECONDS;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_BACKOFF_MS = 5000;

function buildQueueImports(): DynamicModule[] {
  return [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<RedisConfig>(REDIS_CONFIG_KEY);

        if (!redisConfig?.url) {
          throw new Error('REDIS_URL is not configured');
        }

        return { connection: redisUrlToConnection(redisConfig.url) };
      },
    }),
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE,
      defaultJobOptions: {
        attempts: MAX_RETRY_ATTEMPTS,
        backoff: { type: 'exponential', delay: RETRY_BACKOFF_MS },
        removeOnComplete: { age: ONE_HOUR_SECONDS, count: 1000 },
        removeOnFail: { age: ONE_DAY_SECONDS },
      },
    }),
  ];
}

/**
 * Notification module. Inbox and preference APIs (and the persistence they use)
 * are always available. The BullMQ queue is an optional capability: when it is
 * enabled the queue connection, workers and the queue-backed scheduler are
 * registered; when it is disabled BullMQ is never imported or instantiated and a
 * no-op scheduler is provided instead, so the backend starts even on a Redis
 * server that does not meet BullMQ's minimum version.
 *
 * Registered once (globally) so Jobs, Interviews and preferences can depend on
 * the {@link NotificationScheduler} contract without importing this module.
 */
@Module({})
export class NotificationModule {
  static register(): DynamicModule {
    const queueEnabled = isNotificationQueueEnabled();

    const providers: Provider[] = [
      NotificationsService,
      NotificationPreferencesService,
      ...(queueEnabled
        ? [
            NotificationDeliveryService,
            StaleApplicationService,
            NotificationProcessor,
            NotificationSchedulerService,
            {
              provide: NotificationScheduler,
              useExisting: NotificationSchedulerService,
            },
          ]
        : [
            {
              provide: NotificationScheduler,
              useClass: DisabledNotificationScheduler,
            },
          ]),
    ];

    return {
      module: NotificationModule,
      global: true,
      imports: queueEnabled ? buildQueueImports() : [],
      controllers: [NotificationsController, NotificationPreferencesController],
      providers,
      exports: [NotificationScheduler, NotificationPreferencesService],
    };
  }
}
