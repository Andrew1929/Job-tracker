/**
 * Backend-aligned Jobs domain (mirrors the API `JobResponseDto`).
 *
 * Note: the shared mock status enum in `job-status.types.ts` still powers the
 * not-yet-migrated Dashboard/Analytics/Kanban views, so it is intentionally
 * left untouched. This file is the source of truth for the Jobs feature.
 */

export const JOB_STATUSES = [
  "SAVED",
  "APPLIED",
  "SCREENING",
  "INTERVIEWING",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const JOB_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

export type JobPriority = (typeof JOB_PRIORITIES)[number];

export const JOB_SOURCES = [
  "JOB_BOARD",
  "COMPANY_WEBSITE",
  "REFERRAL",
  "RECRUITER",
  "SOCIAL",
  "EVENT",
  "OTHER",
] as const;

export type JobSource = (typeof JOB_SOURCES)[number];

export const REMOTE_TYPES = ["ONSITE", "HYBRID", "REMOTE"] as const;

export type RemoteType = (typeof REMOTE_TYPES)[number];

export const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "TEMPORARY",
] as const;

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export type JobCompanySummary = {
  id: string;
  name: string;
  website: string | null;
  description?: string | null;
};

export type Job = {
  id: string;
  title: string;
  description?: string | null;
  status: JobStatus;
  priority: JobPriority;
  source: JobSource | null;
  location: string | null;
  remoteType: RemoteType | null;
  employmentType: EmploymentType | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  appliedAt: string | null;
  nextActionDate: string | null;
  url: string | null;
  company: JobCompanySummary | null;
  createdAt: string;
  updatedAt: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedJobs = {
  items: Job[];
  meta: PaginationMeta;
};

export const JOB_SORT_FIELDS = [
  "createdAt",
  "updatedAt",
  "appliedAt",
  "title",
  "status",
] as const;

export type JobSortField = (typeof JOB_SORT_FIELDS)[number];

export type SortOrder = "asc" | "desc";

export type JobsQueryParams = {
  page: number;
  limit: number;
  search?: string;
  status?: JobStatus;
  companyId?: string;
  sortBy: JobSortField;
  sortOrder: SortOrder;
};

export type CreateJobInput = {
  title: string;
  description?: string;
  status?: JobStatus;
  priority?: JobPriority;
  source?: JobSource;
  location?: string;
  remoteType?: RemoteType;
  employmentType?: EmploymentType;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  url?: string;
  appliedAt?: string;
  nextActionDate?: string;
  companyName?: string;
};

export type UpdateJobInput = Partial<CreateJobInput>;

export type JobFormMode = "create" | "edit";
