import { ChevronDown } from "lucide-react";

import { JOB_STATUS_BADGE_CLASSES } from "@/constants/job-status.constants";
import { parseJobStatus } from "@/lib/jobs/job-status";
import { cn } from "@/lib/utils";
import { JOB_STATUSES, type JobStatus } from "@/types/job-status.types";

type JobStatusSelectProps = {
  id: string;
  value: JobStatus;
  onChange: (status: JobStatus) => void;
  ariaLabel?: string;
  className?: string;
};

export function JobStatusSelect({
  id,
  value,
  onChange,
  ariaLabel = "Change job status",
  className,
}: JobStatusSelectProps) {
  return (
    <div className={cn("relative inline-flex", className)}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(parseJobStatus(event.target.value))}
        aria-label={ariaLabel}
        className={cn(
          "cursor-pointer appearance-none rounded-md py-1 pl-2.5 pr-7 text-xs font-medium transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          JOB_STATUS_BADGE_CLASSES[value],
        )}
      >
        {JOB_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}
