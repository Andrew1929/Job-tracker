import { JOB_STATUS_BADGE_CLASSES } from "@/constants/job-status.constants";
import { cn } from "@/lib/utils";

import type { JobStatus } from "@/types/job-status.types";

type StatusBadgeProps = {
  status: JobStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
        JOB_STATUS_BADGE_CLASSES[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
