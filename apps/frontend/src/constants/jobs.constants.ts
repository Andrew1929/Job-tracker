import type { SelectOption } from "@/types/select-option.types";
import {
  JOB_STATUSES,
  type JobsQueryParams,
  type JobStatus,
} from "@/types/jobs.types";

export const JOBS_ROUTES = {
  list: "/jobs",
  details: (id: string) => `/jobs/${id}`,
} as const;

export const JOBS_API_PATHS = {
  list: "/api/jobs",
  byId: (id: string) => `/api/jobs/${id}`,
} as const;

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export const JOB_STATUS_BADGE_CLASSES: Record<JobStatus, string> = {
  SAVED: "bg-slate-100 text-slate-700",
  APPLIED: "bg-sky-100 text-sky-700",
  INTERVIEWING: "bg-violet-100 text-violet-700",
  OFFER: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
  WITHDRAWN: "bg-amber-100 text-amber-700",
};

export const JOB_STATUS_OPTIONS: readonly SelectOption[] = JOB_STATUSES.map(
  (status) => ({ value: status, label: JOB_STATUS_LABELS[status] }),
);

export const ALL_FILTER_VALUE = "all";

export const JOB_STATUS_FILTER_OPTIONS: readonly SelectOption[] = [
  { value: ALL_FILTER_VALUE, label: "All statuses" },
  ...JOB_STATUS_OPTIONS,
];

export const JOB_SORT_OPTIONS: readonly SelectOption[] = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "appliedAt:desc", label: "Recently applied" },
  { value: "title:asc", label: "Title (A–Z)" },
  { value: "title:desc", label: "Title (Z–A)" },
  { value: "status:asc", label: "Status" },
];

export const DEFAULT_JOBS_PAGE_SIZE = 20;

export const DEFAULT_JOBS_QUERY: JobsQueryParams = {
  page: 1,
  limit: DEFAULT_JOBS_PAGE_SIZE,
  sortBy: "createdAt",
  sortOrder: "desc",
};
