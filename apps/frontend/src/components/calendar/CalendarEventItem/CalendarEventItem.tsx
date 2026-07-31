import Link from "next/link";

import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { formatDateOnlyShort } from "@/lib/date/date-only";

import type { CalendarEvent } from "@/types/calendar.types";

type CalendarEventItemProps = {
  event: CalendarEvent;
};

export function CalendarEventItem({ event }: CalendarEventItemProps) {
  const meta = event.companyName
    ? `${event.companyName} · ${formatDateOnlyShort(event.dateKey)}`
    : formatDateOnlyShort(event.dateKey);

  return (
    <li>
      <Link
        href={`/jobs/${event.jobId}`}
        className="flex items-start justify-between gap-3 rounded-sm py-3 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-foreground">
            {event.title}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {meta}
          </span>
        </span>
        <JobStatusBadge status={event.status} />
      </Link>
    </li>
  );
}
