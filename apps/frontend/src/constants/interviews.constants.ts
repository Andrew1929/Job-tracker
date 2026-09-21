import { ALL_FILTER_VALUE } from "@/constants/jobs.constants";
import {
  INTERVIEW_RESULTS,
  INTERVIEW_STATUSES,
  INTERVIEW_TYPES,
  type InterviewResult,
  type InterviewStatus,
  type InterviewType,
} from "@/types/interviews.types";

import type { SelectOption } from "@/types/select-option.types";

export const INTERVIEWS_ROUTES = {
  list: "/interviews",
} as const;

export const INTERVIEWS_API_PATHS = {
  list: "/api/interviews",
  byId: (id: string) => `/api/interviews/${id}`,
} as const;

export const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No show",
};

// Same badge recipe as `JOB_STATUS_BADGE_CLASSES`: a 100-level tint with a
// 700-level foreground, so job and interview badges read as one family.
export const INTERVIEW_STATUS_BADGE_CLASSES: Record<InterviewStatus, string> = {
  SCHEDULED: "bg-sky-100 text-sky-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-slate-100 text-slate-700",
  NO_SHOW: "bg-rose-100 text-rose-700",
};

export const INTERVIEW_STATUS_OPTIONS: readonly SelectOption[] =
  INTERVIEW_STATUSES.map((status) => ({
    value: status,
    label: INTERVIEW_STATUS_LABELS[status],
  }));

export const INTERVIEW_STATUS_FILTER_OPTIONS: readonly SelectOption[] = [
  { value: ALL_FILTER_VALUE, label: "All statuses" },
  ...INTERVIEW_STATUS_OPTIONS,
];

export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  PHONE_SCREEN: "Phone screen",
  TECHNICAL: "Technical",
  BEHAVIORAL: "Behavioral",
  SYSTEM_DESIGN: "System design",
  ONSITE: "On-site",
  HR: "HR",
  FINAL: "Final",
  OTHER: "Other",
};

export const INTERVIEW_TYPE_OPTIONS: readonly SelectOption[] =
  INTERVIEW_TYPES.map((type) => ({
    value: type,
    label: INTERVIEW_TYPE_LABELS[type],
  }));

export const INTERVIEW_TYPE_FILTER_OPTIONS: readonly SelectOption[] = [
  { value: ALL_FILTER_VALUE, label: "All types" },
  ...INTERVIEW_TYPE_OPTIONS,
];

export const INTERVIEW_RESULT_LABELS: Record<InterviewResult, string> = {
  PENDING: "Pending",
  PASSED: "Passed",
  FAILED: "Failed",
};

export const INTERVIEW_RESULT_BADGE_CLASSES: Record<InterviewResult, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PASSED: "bg-green-100 text-green-700",
  FAILED: "bg-rose-100 text-rose-700",
};

export const INTERVIEW_RESULT_OPTIONS: readonly SelectOption[] =
  INTERVIEW_RESULTS.map((result) => ({
    value: result,
    label: INTERVIEW_RESULT_LABELS[result],
  }));

export const ALL_JOBS_FILTER_OPTION: SelectOption = {
  value: ALL_FILTER_VALUE,
  label: "All jobs",
};

/**
 * The API orders interviews by `scheduledAt` only, so the sort control offers
 * exactly the two directions it supports.
 */
export const INTERVIEW_SORT_OPTIONS: readonly SelectOption[] = [
  { value: "asc", label: "Upcoming first" },
  { value: "desc", label: "Latest first" },
];

export const DEFAULT_INTERVIEW_SORT_VALUE = "asc";

export const INTERVIEW_RATING_MIN = 1;
export const INTERVIEW_RATING_MAX = 5;

const RATING_VALUES = Array.from(
  { length: INTERVIEW_RATING_MAX - INTERVIEW_RATING_MIN + 1 },
  (_, index) => INTERVIEW_RATING_MIN + index,
);

/** Rating and difficulty are 1–5 integers server-side, or unset. */
export const INTERVIEW_RATING_OPTIONS: readonly SelectOption[] = [
  { value: "", label: "Not rated" },
  ...RATING_VALUES.map((value) => ({
    value: String(value),
    label: `${value} / ${INTERVIEW_RATING_MAX}`,
  })),
];

export const INTERVIEW_MAX_DURATION_MINUTES = 24 * 60;
export const INTERVIEW_MAX_INTERVIEWERS = 20;
export const INTERVIEW_INTERVIEWER_MAX_LENGTH = 200;
export const INTERVIEW_LOCATION_MAX_LENGTH = 200;
export const INTERVIEW_NOTES_MAX_LENGTH = 5000;

/**
 * The interviews endpoint caps a page at 100 items. Search, type filtering and
 * paging all happen on the client, so the page loads one server page of this
 * size and refines it locally; realistic interview volumes fit comfortably.
 */
export const INTERVIEWS_FETCH_LIMIT = 100;

/** Rows per client-side page inside the list card. */
export const INTERVIEWS_PAGE_SIZE = 10;

/** Window behind the "This week" summary card. */
export const INTERVIEW_UPCOMING_WINDOW_DAYS = 7;

/** Jobs loaded for the job filter and the form's job picker. */
export const INTERVIEW_JOB_OPTIONS_LIMIT = 100;
