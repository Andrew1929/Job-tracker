import type { JobStatus } from "@/types/job-status.types";

export type JobsViewMode = "list" | "grid";

export type JobListItem = {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  appliedDate: string;
  salary: number;
};

export type JobFormMode = "create" | "edit";

export type JobTimelineStepState = "completed" | "current" | "upcoming";

export type JobTimelineStep = {
  readonly id: string;
  readonly label: string;
  readonly date?: string;
  readonly state: JobTimelineStepState;
};

export type JobAttachment = {
  readonly id: string;
  readonly name: string;
};

export type JobDetails = JobListItem & {
  readonly companyInitial: string;
  readonly companyColor: string;
  readonly location: string;
  readonly jobPostingUrl: string;
  readonly tags: readonly string[];
  readonly notes: readonly string[];
  readonly timeline: readonly JobTimelineStep[];
  readonly attachments: readonly JobAttachment[];
};
