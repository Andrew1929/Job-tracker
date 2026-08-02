import { NotificationJobName } from '../constants/notification.constants';

/**
 * Queue payloads. Each carries the *expected source value* (the date the
 * reminder was scheduled against) so the worker can detect and skip jobs made
 * stale by a later edit, without trusting the payload as the source of truth.
 */

export interface NextActionReminderJobData {
  jobId: string;
  userId: string;
  /** The `nextActionDate` the reminder was scheduled for, as an ISO string. */
  expectedNextActionDate: string;
}

export interface InterviewReminderJobData {
  interviewId: string;
  userId: string;
  /** The `scheduledAt` the reminder was scheduled for, as an ISO string. */
  expectedScheduledAt: string;
  leadMinutes: number;
}

export interface InterviewFollowUpJobData {
  interviewId: string;
  userId: string;
  /** The `completedAt` the follow-up was scheduled for, as an ISO string. */
  expectedCompletedAt: string;
}

export type NotificationJobData =
  | NextActionReminderJobData
  | InterviewReminderJobData
  | InterviewFollowUpJobData
  | Record<string, never>;

export type NotificationJobDataByName = {
  [NotificationJobName.NEXT_ACTION_REMINDER]: NextActionReminderJobData;
  [NotificationJobName.INTERVIEW_REMINDER]: InterviewReminderJobData;
  [NotificationJobName.INTERVIEW_FOLLOW_UP]: InterviewFollowUpJobData;
  [NotificationJobName.STALE_APPLICATION_SCAN]: Record<string, never>;
  [NotificationJobName.RECONCILE]: Record<string, never>;
};
