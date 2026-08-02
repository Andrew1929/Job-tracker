import {
  InterviewStatus,
  JobStatus,
} from '../../../../generated/prisma/client';

export interface NextActionSchedulingInput {
  id: string;
  userId: string;
  status: JobStatus;
  nextActionDate: Date | null;
}

export interface InterviewSchedulingInput {
  id: string;
  userId: string;
  status: InterviewStatus;
  scheduledAt: Date;
  completedAt: Date | null;
}

/**
 * Scheduling boundary between business triggers (Jobs, Interviews, preference
 * changes) and the reminder queue. Callers depend on this contract, not on
 * BullMQ, so the queue can be an optional capability: when it is enabled a
 * BullMQ-backed implementation is provided; when it is disabled (e.g. the Redis
 * server does not meet BullMQ's minimum version) a no-op implementation is
 * provided and the core application keeps working without delayed reminders.
 */
export abstract class NotificationScheduler {
  abstract syncNextActionReminder(
    job: NextActionSchedulingInput,
  ): Promise<void>;

  abstract cancelNextActionReminder(jobId: string): Promise<void>;

  abstract syncInterview(
    interview: InterviewSchedulingInput,
    previousLeads?: number[],
  ): Promise<void>;

  abstract cancelInterviewJobs(
    interviewId: string,
    userId: string,
  ): Promise<void>;

  abstract cancelInterviewJobsForJob(
    jobId: string,
    userId: string,
  ): Promise<void>;

  abstract resyncUserReminders(
    userId: string,
    previousInterviewLeads?: number[],
  ): Promise<void>;

  abstract reconcile(): Promise<void>;
}
