/**
 * Backend-aligned Interviews domain (mirrors the API `InterviewResponseDto`).
 *
 * Concepts already owned by the jobs domain — pagination meta, sort order and
 * the remote/work mode enum — are re-exported from `@/types/jobs.types` rather
 * than redeclared, so an interview and a job can never disagree about them.
 */

import type {
  PaginationMeta,
  RemoteType,
  SortOrder,
} from "@/types/jobs.types";

export type { PaginationMeta, RemoteType, SortOrder };

export const INTERVIEW_STATUSES = [
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const;

export type InterviewStatus = (typeof INTERVIEW_STATUSES)[number];

export const INTERVIEW_TYPES = [
  "PHONE_SCREEN",
  "TECHNICAL",
  "BEHAVIORAL",
  "SYSTEM_DESIGN",
  "ONSITE",
  "HR",
  "FINAL",
  "OTHER",
] as const;

export type InterviewType = (typeof INTERVIEW_TYPES)[number];

export const INTERVIEW_RESULTS = ["PENDING", "PASSED", "FAILED"] as const;

export type InterviewResult = (typeof INTERVIEW_RESULTS)[number];

export type InterviewCompanySummary = {
  id: string;
  name: string;
};

/** Nested job the API returns with every interview. */
export type InterviewJobSummary = {
  id: string;
  title: string;
  company: InterviewCompanySummary | null;
};

export type Interview = {
  id: string;
  type: InterviewType;
  status: InterviewStatus;
  result: InterviewResult;
  /** Scheduled instant, not a calendar date: the time of day is meaningful. */
  scheduledAt: string;
  completedAt: string | null;
  durationMinutes: number | null;
  remoteType: RemoteType | null;
  location: string | null;
  interviewers: string[];
  prepNotes: string | null;
  feedback: string | null;
  rating: number | null;
  difficulty: number | null;
  jobId: string;
  job: InterviewJobSummary;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedInterviews = {
  items: Interview[];
  meta: PaginationMeta;
};

/**
 * Everything `GET /api/interviews` accepts. The endpoint has no search, no
 * type filter and no date range, and it orders only by `scheduledAt`, so those
 * refinements are applied on the client.
 */
export type InterviewsQueryParams = {
  page: number;
  limit: number;
  jobId?: string;
  status?: InterviewStatus;
  sortOrder: SortOrder;
};

export type CreateInterviewInput = {
  jobId: string;
  type: InterviewType;
  scheduledAt: string;
  status?: InterviewStatus;
  result?: InterviewResult;
  completedAt?: string;
  durationMinutes?: number;
  remoteType?: RemoteType;
  location?: string;
  interviewers?: string[];
  prepNotes?: string;
  feedback?: string;
  rating?: number;
  difficulty?: number;
};

/** `jobId` is immutable server-side: an interview cannot move between jobs. */
export type UpdateInterviewInput = Partial<Omit<CreateInterviewInput, "jobId">>;

export type InterviewFormMode = "create" | "edit";
