import { cn } from "@/lib/utils";

import type { JobStatus } from "@/types/job-status.types";

type StatusBadgeProps = {
  status: JobStatus;
  className?: string;
};

const statusStyles: Record<JobStatus, string> = {
  Interview: "bg-emerald-100 text-emerald-700",
  Applied: "bg-sky-100 text-sky-700",
  Offer: "bg-emerald-100 text-emerald-700",
  Screening: "bg-violet-100 text-violet-700",
  Rejected: "bg-rose-100 text-rose-700",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
