import { getQueueToken } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { NOTIFICATION_QUEUE } from './constants/notification.constants';
import { NotificationModule } from './notification.module';
import { NotificationProcessor } from './processors/notification.processor';
import {
  NOTIFICATION_QUEUE_ENABLED_ENV,
  isNotificationQueueEnabled,
} from './queue/notification-queue.config';
import { DisabledNotificationScheduler } from './services/disabled-notification-scheduler';
import { NotificationPreferencesService } from './services/notification-preferences.service';
import { NotificationScheduler } from './services/notification-scheduler';
import { NotificationsService } from './services/notifications.service';

@Global()
@Module({
  providers: [{ provide: PrismaService, useValue: {} }],
  exports: [PrismaService],
})
class PrismaStubModule {}

describe('NotificationModule (queue disabled)', () => {
  const previous = process.env[NOTIFICATION_QUEUE_ENABLED_ENV];

  beforeAll(() => {
    process.env[NOTIFICATION_QUEUE_ENABLED_ENV] = 'false';
  });

  afterAll(() => {
    if (previous === undefined) {
      delete process.env[NOTIFICATION_QUEUE_ENABLED_ENV];
    } else {
      process.env[NOTIFICATION_QUEUE_ENABLED_ENV] = previous;
    }
  });

  it('reports the capability as disabled', () => {
    expect(isNotificationQueueEnabled()).toBe(false);
  });

  it('bootstraps without BullMQ and provides the no-op scheduler', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaStubModule, NotificationModule.register()],
    }).compile();

    // Inbox and preference features remain available.
    expect(moduleRef.get(NotificationsService)).toBeInstanceOf(
      NotificationsService,
    );
    expect(moduleRef.get(NotificationPreferencesService)).toBeInstanceOf(
      NotificationPreferencesService,
    );

    // Scheduling boundary resolves to the no-op implementation.
    const scheduler = moduleRef.get(NotificationScheduler);
    expect(scheduler).toBeInstanceOf(DisabledNotificationScheduler);

    // No BullMQ queue and no processor are instantiated.
    expect(() => {
      moduleRef.get(getQueueToken(NOTIFICATION_QUEUE));
    }).toThrow();
    expect(() => moduleRef.get(NotificationProcessor)).toThrow();

    // Scheduler calls are safe no-ops rather than throwing.
    await expect(
      scheduler.syncNextActionReminder({
        id: 'job-1',
        userId: 'user-1',
        status: 'SAVED',
        nextActionDate: new Date(),
      }),
    ).resolves.toBeUndefined();

    await moduleRef.close();
  });
});
