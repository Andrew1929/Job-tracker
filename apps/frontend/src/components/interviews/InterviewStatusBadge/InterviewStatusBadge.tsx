import {
  INTERVIEW_STATUS_BADGE_CLASSES,
  INTERVIEW_STATUS_LABELS,
} from "@/constants/interviews.constants";
import { cn } from "@/lib/utils";

import type { InterviewStatus } from "@/types/interviews.types";

type InterviewStatusBadgeProps = {
  status: InterviewStatus;
  className?: string;
};

export function InterviewStatusBadge({
  status,
  className,
}: InterviewStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
        INTERVIEW_STATUS_BADGE_CLASSES[status],
        className,
      )}
    >
      {INTERVIEW_STATUS_LABELS[status]}
    </span>
  );
}
