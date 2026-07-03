import type { JobStatus } from "@/types/job-status.types";

export const JOB_STATUS_BADGE_CLASSES: Record<JobStatus, string> = {
  Interview: "bg-emerald-100 text-emerald-700",
  Applied: "bg-sky-100 text-sky-700",
  Offer: "bg-emerald-100 text-emerald-700",
  Screening: "bg-violet-100 text-violet-700",
  Rejected: "bg-rose-100 text-rose-700",
};
