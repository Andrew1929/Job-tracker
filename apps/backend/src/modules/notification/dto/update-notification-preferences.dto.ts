import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { IsIanaTimeZone } from '../../../common/validators/is-iana-timezone.validator';

const MAX_LEAD_MINUTES = 30 * 24 * 60; // 30 days
const MAX_FOLLOW_UP_DELAY_MINUTES = 30 * 24 * 60;
const MAX_STALE_THRESHOLD_DAYS = 365;
const MAX_INTERVIEW_LEADS = 5;

/**
 * Every field is optional so the client can patch a single preference. All
 * numeric offsets and the timezone are validated; client-supplied values are
 * never trusted.
 */
export class UpdateNotificationPreferencesDto {
  @IsOptional()
  @IsBoolean()
  inAppEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  nextActionRemindersEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  interviewRemindersEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  interviewFollowUpsEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  staleApplicationRemindersEnabled?: boolean;

  @IsOptional()
  @IsIanaTimeZone()
  timezone?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(MAX_LEAD_MINUTES)
  nextActionReminderLeadMinutes?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_INTERVIEW_LEADS)
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(MAX_LEAD_MINUTES, { each: true })
  interviewReminderLeadMinutes?: number[];

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(MAX_FOLLOW_UP_DELAY_MINUTES)
  interviewFollowUpDelayMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_STALE_THRESHOLD_DAYS)
  staleApplicationThresholdDays?: number;
}
