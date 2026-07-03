import { JOB_STATUSES, type JobStatus } from "@/types/job-status.types";

export function parseJobStatus(value: string): JobStatus {
  return JOB_STATUSES.find((status) => status === value) ?? "Applied";
}
