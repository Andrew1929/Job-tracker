import {
  INTERVIEW_RESULT_BADGE_CLASSES,
  INTERVIEW_RESULT_LABELS,
} from "@/constants/interviews.constants";
import { cn } from "@/lib/utils";

import type { InterviewResult } from "@/types/interviews.types";

type InterviewResultBadgeProps = {
  result: InterviewResult;
  className?: string;
};

export function InterviewResultBadge({
  result,
  className,
}: InterviewResultBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
        INTERVIEW_RESULT_BADGE_CLASSES[result],
        className,
      )}
    >
      {INTERVIEW_RESULT_LABELS[result]}
    </span>
  );
}
