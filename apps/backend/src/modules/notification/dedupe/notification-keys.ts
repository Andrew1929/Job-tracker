/**
 * Deterministic key builders.
 *
 * - Queue job ids are keyed by entity (+ offset) but NOT by date, so at most one
 *   job per entity/offset exists in the queue. Rescheduling removes the old id
 *   and re-adds it, and re-adding an unchanged reminder is a no-op.
 * - Dedupe keys are keyed by entity AND the source date, so notification
 *   creation is idempotent across worker retries while a genuinely new date
 *   (a rescheduled action) produces a new key and a fresh notification.
 *
 * Queue job ids must not contain ':' — BullMQ builds its Redis keys as
 * `prefix:queue:jobId` and rejects custom ids containing the separator. They use
 * QUEUE_ID_SEPARATOR instead, which cannot occur in the uuid entity ids.
 * Dedupe keys are plain database values and keep ':'.
 */

const toIso = (date: Date): string => date.toISOString();

const QUEUE_ID_SEPARATOR = '_';

export const queueJobId = {
  nextAction: (jobId: string): string =>
    `next-action${QUEUE_ID_SEPARATOR}${jobId}`,
  interviewReminder: (interviewId: string, leadMinutes: number): string =>
    `interview-reminder${QUEUE_ID_SEPARATOR}${interviewId}${QUEUE_ID_SEPARATOR}${leadMinutes}`,
  interviewFollowUp: (interviewId: string): string =>
    `interview-follow-up${QUEUE_ID_SEPARATOR}${interviewId}`,
};

export const dedupeKey = {
  nextActionUpcoming: (
    jobId: string,
    nextActionDate: Date,
    leadMinutes: number,
  ): string => `next-action:${jobId}:${toIso(nextActionDate)}:${leadMinutes}m`,

  nextActionOverdue: (jobId: string, nextActionDate: Date): string =>
    `next-action-overdue:${jobId}:${toIso(nextActionDate)}`,

  interviewReminder: (
    interviewId: string,
    scheduledAt: Date,
    leadMinutes: number,
  ): string => `interview:${interviewId}:${toIso(scheduledAt)}:${leadMinutes}m`,

  interviewFollowUp: (interviewId: string, completedAt: Date): string =>
    `interview-follow-up:${interviewId}:${toIso(completedAt)}`,

  staleApplication: (jobId: string, lastActivityAt: Date): string =>
    `stale-application:${jobId}:${toIso(lastActivityAt)}`,
};
