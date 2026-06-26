import { cn } from "@/lib/utils";

import type { ApplicationStatus } from "@/types/dashboard.types";

type StatusBadgeProps = {
  status: ApplicationStatus;
  className?: string;
};

const statusStyles: Record<ApplicationStatus, string> = {
  Interview: "bg-sky-100 text-sky-700",
  Applied: "bg-slate-100 text-slate-600",
  Offer: "bg-emerald-100 text-emerald-700",
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
