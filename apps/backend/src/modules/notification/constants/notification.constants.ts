import { JobStatus } from '../../../../generated/prisma/client';

export const NOTIFICATION_QUEUE = 'notifications';

/** Queue job names handled by the notification processor. */
export const NotificationJobName = {
  NEXT_ACTION_REMINDER: 'next-action-reminder',
  INTERVIEW_REMINDER: 'interview-reminder',
  INTERVIEW_FOLLOW_UP: 'interview-follow-up',
  STALE_APPLICATION_SCAN: 'stale-application-scan',
  RECONCILE: 'reconcile',
} as const;

export type NotificationJobName =
  (typeof NotificationJobName)[keyof typeof NotificationJobName];

/** Deterministic ids for the repeatable schedulers (idempotent across restarts). */
export const NotificationSchedulerId = {
  STALE_APPLICATION_SCAN: 'stale-application-scan',
  RECONCILE: 'reconcile',
} as const;

/**
 * Job statuses in which a next-action reminder is no longer meaningful. Kept in
 * one place so the domain rule is not duplicated across scheduler and worker.
 */
export const TERMINAL_JOB_STATUSES: readonly JobStatus[] = [
  JobStatus.ACCEPTED,
  JobStatus.REJECTED,
  JobStatus.WITHDRAWN,
];

export function isTerminalJobStatus(status: JobStatus): boolean {
  return TERMINAL_JOB_STATUSES.includes(status);
}

/** Default reminder/threshold offsets, used when a user has no stored override. */
export const NOTIFICATION_DEFAULTS = {
  NEXT_ACTION_LEAD_MINUTES: 1440,
  INTERVIEW_LEAD_MINUTES: [1440, 120] as const,
  INTERVIEW_FOLLOW_UP_DELAY_MINUTES: 1440,
  STALE_THRESHOLD_DAYS: 7,
  TIMEZONE: 'UTC',
} as const;

/** Local hour (0-23) at which stale-application reminders are delivered. */
export const STALE_SCAN_LOCAL_HOUR = 9;

/** How often the reconciliation scheduler re-syncs future reminders. */
export const RECONCILE_INTERVAL_MS = 6 * 60 * 60 * 1000;

/** Cron pattern for the hourly stale-application scan. */
export const STALE_SCAN_CRON = '0 * * * *';

/** Bounded page size for scans so a run never loads an unbounded result set. */
export const SCAN_BATCH_SIZE = 200;

export const MINUTES_TO_MS = 60 * 1000;
export const DAYS_TO_MS = 24 * 60 * MINUTES_TO_MS;
