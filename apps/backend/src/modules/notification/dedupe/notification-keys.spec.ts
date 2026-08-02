import { dedupeKey, queueJobId } from './notification-keys';

describe('notification-keys', () => {
  const jobId = 'job-1';
  const interviewId = 'interview-1';
  const date = new Date('2026-08-10T09:00:00.000Z');

  describe('queue job ids', () => {
    it('are stable per entity and independent of the date', () => {
      expect(queueJobId.nextAction(jobId)).toBe('next-action_job-1');
      expect(queueJobId.interviewReminder(interviewId, 1440)).toBe(
        'interview-reminder_interview-1_1440',
      );
      expect(queueJobId.interviewFollowUp(interviewId)).toBe(
        'interview-follow-up_interview-1',
      );
    });

    // BullMQ rejects custom job ids containing ':', so an id built with one
    // would make `queue.add` throw and the reminder would never be scheduled.
    it('never contain the BullMQ-reserved separator', () => {
      const ids = [
        queueJobId.nextAction(jobId),
        queueJobId.interviewReminder(interviewId, 1440),
        queueJobId.interviewFollowUp(interviewId),
      ];

      for (const id of ids) {
        expect(id).not.toContain(':');
      }
    });
  });

  describe('dedupe keys', () => {
    it('are deterministic for the same source date', () => {
      expect(dedupeKey.nextActionUpcoming(jobId, date, 1440)).toBe(
        dedupeKey.nextActionUpcoming(jobId, new Date(date), 1440),
      );
    });

    it('change when the source date changes, allowing a fresh notification', () => {
      const later = new Date('2026-08-11T09:00:00.000Z');
      expect(dedupeKey.nextActionUpcoming(jobId, date, 1440)).not.toBe(
        dedupeKey.nextActionUpcoming(jobId, later, 1440),
      );
    });

    it('distinguish upcoming from overdue for the same date', () => {
      expect(dedupeKey.nextActionUpcoming(jobId, date, 1440)).not.toBe(
        dedupeKey.nextActionOverdue(jobId, date),
      );
    });

    it('distinguish interview lead offsets', () => {
      expect(dedupeKey.interviewReminder(interviewId, date, 1440)).not.toBe(
        dedupeKey.interviewReminder(interviewId, date, 120),
      );
    });
  });
});
