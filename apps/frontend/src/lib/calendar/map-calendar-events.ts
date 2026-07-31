import { toDateOnlyKey } from "@/lib/date/date-only";

import type { CalendarEvent } from "@/types/calendar.types";
import type { Job } from "@/types/jobs.types";

/**
 * Total order for events so a given day always renders in the same sequence,
 * regardless of the order the API returned them in.
 */
function compareEvents(a: CalendarEvent, b: CalendarEvent): number {
  if (a.dateKey !== b.dateKey) {
    return a.dateKey < b.dateKey ? -1 : 1;
  }

  const byTitle = a.title.localeCompare(b.title);
  return byTitle !== 0 ? byTitle : a.id.localeCompare(b.id);
}

function toCalendarEvent(job: Job): CalendarEvent[] {
  const dateKey = toDateOnlyKey(job.nextActionDate);
  if (!dateKey) {
    return [];
  }

  return [
    {
      id: job.id,
      jobId: job.id,
      title: job.title,
      companyName: job.company?.name ?? null,
      status: job.status,
      dateKey,
    },
  ];
}

/**
 * Converts jobs with a scheduled next action into calendar events. Jobs without
 * a usable date are dropped rather than rendered on an arbitrary day.
 */
export function mapJobsToCalendarEvents(jobs: Job[]): CalendarEvent[] {
  return jobs.flatMap(toCalendarEvent).sort(compareEvents);
}

/**
 * Groups events once per data change so each calendar cell is an O(1) lookup
 * instead of scanning the full event array.
 */
export function groupEventsByDateKey(
  events: CalendarEvent[],
): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();

  for (const event of events) {
    const existing = grouped.get(event.dateKey);

    if (existing) {
      existing.push(event);
    } else {
      grouped.set(event.dateKey, [event]);
    }
  }

  return grouped;
}
