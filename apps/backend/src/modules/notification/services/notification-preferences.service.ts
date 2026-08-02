import { Injectable } from '@nestjs/common';
import { NotificationPreferences } from '../../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateNotificationPreferencesDto } from '../dto/update-notification-preferences.dto';
import { NotificationScheduler } from './notification-scheduler';

const SCHEDULING_PREFERENCE_KEYS = [
  'nextActionReminderLeadMinutes',
  'interviewReminderLeadMinutes',
  'interviewFollowUpDelayMinutes',
  'nextActionRemindersEnabled',
  'interviewRemindersEnabled',
  'interviewFollowUpsEnabled',
] as const;

@Injectable()
export class NotificationPreferencesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scheduler: NotificationScheduler,
  ) {}

  /**
   * Lazily materializes preferences on first read using the schema defaults, so
   * existing users never need a separate initialization step.
   */
  async getOrCreate(userId: string): Promise<NotificationPreferences> {
    return this.prisma.notificationPreferences.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  }

  /** Non-creating lookup, used by scans that must not write a row per user. */
  findByUserId(userId: string): Promise<NotificationPreferences | null> {
    return this.prisma.notificationPreferences.findUnique({
      where: { userId },
    });
  }

  async update(
    userId: string,
    dto: UpdateNotificationPreferencesDto,
  ): Promise<NotificationPreferences> {
    const previous = await this.prisma.notificationPreferences.findUnique({
      where: { userId },
      select: { interviewReminderLeadMinutes: true },
    });

    const preferences = await this.prisma.notificationPreferences.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: dto,
    });

    if (this.affectsScheduling(dto)) {
      await this.scheduler.resyncUserReminders(
        userId,
        previous?.interviewReminderLeadMinutes ?? [],
      );
    }

    return preferences;
  }

  private affectsScheduling(dto: UpdateNotificationPreferencesDto): boolean {
    return SCHEDULING_PREFERENCE_KEYS.some((key) => dto[key] !== undefined);
  }
}
