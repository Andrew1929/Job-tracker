"use client";

import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { startOfToday } from "@/lib/calendar/calendar-dates";
import { JOB_STATUSES } from "@/types/jobs.types";

export function CalendarLegend() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Calendar Legend</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground">
              Application status
            </p>
            <p className="text-xs text-muted-foreground">
              Each scheduled action takes the colour of its job&apos;s status.
            </p>
          </div>

          {/* Same badges the calendar renders, so colours and labels can never
              drift from the events they describe. */}
          <ul className="flex flex-wrap gap-2">
            {JOB_STATUSES.map((status) => (
              <li key={status}>
                <JobStatusBadge status={status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3 border-t border-border/60 pt-4">
          <span
            aria-hidden="true"
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
          >
            {startOfToday().getDate()}
          </span>

          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Today</p>
            <p className="text-xs text-muted-foreground">
              The current date is highlighted in the calendar.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
