import {
  JOB_STATUS_BADGE_CLASSES,
  JOB_STATUS_LABELS,
} from "@/constants/jobs.constants";
import { cn } from "@/lib/utils";

import type { JobStatus } from "@/types/jobs.types";

type JobStatusBadgeProps = {
  status: JobStatus;
  className?: string;
};

export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
        JOB_STATUS_BADGE_CLASSES[status],
        className,
      )}
    >
      {JOB_STATUS_LABELS[status]}
    </span>
  );
}
