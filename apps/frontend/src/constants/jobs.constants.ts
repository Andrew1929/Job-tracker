import type { SelectOption } from "@/types/select-option.types";
import {
  EMPLOYMENT_TYPES,
  JOB_PRIORITIES,
  JOB_SOURCES,
  JOB_STATUSES,
  REMOTE_TYPES,
  type EmploymentType,
  type JobPriority,
  type JobsQueryParams,
  type JobSource,
  type JobStatus,
  type RemoteType,
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
  SCREENING: "Screening",
  INTERVIEWING: "Interviewing",
  OFFER: "Offer",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export const JOB_STATUS_BADGE_CLASSES: Record<JobStatus, string> = {
  SAVED: "bg-slate-100 text-slate-700",
  APPLIED: "bg-sky-100 text-sky-700",
  SCREENING: "bg-indigo-100 text-indigo-700",
  INTERVIEWING: "bg-violet-100 text-violet-700",
  OFFER: "bg-emerald-100 text-emerald-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-rose-100 text-rose-700",
  WITHDRAWN: "bg-amber-100 text-amber-700",
};

export const JOB_STATUS_OPTIONS: readonly SelectOption[] = JOB_STATUSES.map(
  (status) => ({ value: status, label: JOB_STATUS_LABELS[status] }),
);

export const JOB_PRIORITY_LABELS: Record<JobPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const JOB_PRIORITY_BADGE_CLASSES: Record<JobPriority, string> = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-rose-100 text-rose-700",
};

export const JOB_PRIORITY_OPTIONS: readonly SelectOption[] = JOB_PRIORITIES.map(
  (priority) => ({ value: priority, label: JOB_PRIORITY_LABELS[priority] }),
);

export const JOB_SOURCE_LABELS: Record<JobSource, string> = {
  JOB_BOARD: "Job board",
  COMPANY_WEBSITE: "Company website",
  REFERRAL: "Referral",
  RECRUITER: "Recruiter",
  SOCIAL: "Social",
  EVENT: "Event",
  OTHER: "Other",
};

export const REMOTE_TYPE_LABELS: Record<RemoteType, string> = {
  ONSITE: "On-site",
  HYBRID: "Hybrid",
  REMOTE: "Remote",
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  TEMPORARY: "Temporary",
};

// Optional enum fields render a leading "not set" choice so the form can clear
// them; an empty value maps back to `undefined` on submit.
export const NOT_SPECIFIED_OPTION: SelectOption = {
  value: "",
  label: "Not specified",
};

export const JOB_SOURCE_OPTIONS: readonly SelectOption[] = [
  NOT_SPECIFIED_OPTION,
  ...JOB_SOURCES.map((source) => ({
    value: source,
    label: JOB_SOURCE_LABELS[source],
  })),
];

export const REMOTE_TYPE_OPTIONS: readonly SelectOption[] = [
  NOT_SPECIFIED_OPTION,
  ...REMOTE_TYPES.map((type) => ({
    value: type,
    label: REMOTE_TYPE_LABELS[type],
  })),
];

export const EMPLOYMENT_TYPE_OPTIONS: readonly SelectOption[] = [
  NOT_SPECIFIED_OPTION,
  ...EMPLOYMENT_TYPES.map((type) => ({
    value: type,
    label: EMPLOYMENT_TYPE_LABELS[type],
  })),
];

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
