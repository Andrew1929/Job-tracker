import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { NotificationPreferences } from '../../../../generated/prisma/client';

@Exclude()
export class NotificationPreferencesResponseDto {
  @Expose()
  inAppEnabled!: boolean;

  @Expose()
  nextActionRemindersEnabled!: boolean;

  @Expose()
  interviewRemindersEnabled!: boolean;

  @Expose()
  interviewFollowUpsEnabled!: boolean;

  @Expose()
  staleApplicationRemindersEnabled!: boolean;

  @Expose()
  timezone!: string;

  @Expose()
  nextActionReminderLeadMinutes!: number;

  @Expose()
  interviewReminderLeadMinutes!: number[];

  @Expose()
  interviewFollowUpDelayMinutes!: number;

  @Expose()
  staleApplicationThresholdDays!: number;

  static fromEntity(
    preferences: NotificationPreferences,
  ): NotificationPreferencesResponseDto {
    return plainToInstance(NotificationPreferencesResponseDto, preferences);
  }
}
