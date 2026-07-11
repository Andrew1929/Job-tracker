import {
  JOB_PRIORITY_BADGE_CLASSES,
  JOB_PRIORITY_LABELS,
} from "@/constants/jobs.constants";
import { cn } from "@/lib/utils";

import type { JobPriority } from "@/types/jobs.types";

type JobPriorityBadgeProps = {
  priority: JobPriority;
  className?: string;
};

export function JobPriorityBadge({ priority, className }: JobPriorityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
        JOB_PRIORITY_BADGE_CLASSES[priority],
        className,
      )}
    >
      {JOB_PRIORITY_LABELS[priority]}
    </span>
  );
}
