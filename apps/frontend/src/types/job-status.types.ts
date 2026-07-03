export const JOB_STATUSES = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];
