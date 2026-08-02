import Link from "next/link";

import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import {
  JOB_STATUS_BADGE_CLASSES,
  JOB_STATUS_LABELS,
  JOBS_ROUTES,
} from "@/constants/jobs.constants";
import { cn } from "@/lib/utils";

import type { CalendarEvent } from "@/types/calendar.types";

type CalendarEventBlockProps = {
  event: CalendarEvent;
  /**
   * `compact` fits month cells and week columns; `detailed` is for the day view
   * where there is room for the company and an explicit status badge.
   */
  variant?: "compact" | "detailed";
};

/**
 * Status colour alone must not carry meaning, so the status label is always
 * part of the link's accessible name and is shown as text in `detailed`.
 */
function buildAccessibleLabel(event: CalendarEvent): string {
  const company = event.companyName ? ` at ${event.companyName}` : "";
  return `${event.title}${company} — ${JOB_STATUS_LABELS[event.status]}`;
}

export function CalendarEventBlock({
  event,
  variant = "compact",
}: CalendarEventBlockProps) {
  const className = cn(
    "block rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
    variant === "compact"
      ? cn("px-2 py-1 text-xs font-medium", JOB_STATUS_BADGE_CLASSES[event.status])
      : "border border-border/60 bg-card p-3 shadow-sm",
  );

  return (
    <Link
      href={JOBS_ROUTES.details(event.jobId)}
      className={className}
      aria-label={buildAccessibleLabel(event)}
    >
      {variant === "compact" ? (
        <span className="block truncate">{event.title}</span>
      ) : (
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-foreground">
              {event.title}
            </span>
            {event.companyName ? (
              <span className="block truncate text-xs text-muted-foreground">
                {event.companyName}
              </span>
            ) : null}
          </span>
          <JobStatusBadge status={event.status} />
        </span>
      )}
    </Link>
  );
}
