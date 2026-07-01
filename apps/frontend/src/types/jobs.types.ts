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
