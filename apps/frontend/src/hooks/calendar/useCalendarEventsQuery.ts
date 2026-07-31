"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { CALENDAR_EVENTS_PAGE_SIZE } from "@/constants/calendar.constants";
import { dateOnlyKeyToIso } from "@/lib/date/date-only";
import { jobKeys } from "@/lib/query/query-keys";
import { getJobs } from "@/services/jobs.service";

import type { CalendarDateRange } from "@/types/calendar.types";
import type { JobsQueryParams } from "@/types/jobs.types";

/**
 * Fetches only the scheduled actions inside the visible range.
 *
 * The query key is the shared `jobKeys.list` factory rather than a calendar
 * specific one, because this really is a filtered jobs list: existing job
 * mutations already invalidate `jobKeys.lists()`, so editing a job's next
 * action date refreshes the calendar with no extra wiring. Each range is cached
 * separately, and `keepPreviousData` keeps the previous range on screen while
 * the next one loads instead of blanking the grid.
 */
export function useCalendarEventsQuery(range: CalendarDateRange) {
  const params: JobsQueryParams = {
    page: 1,
    limit: CALENDAR_EVENTS_PAGE_SIZE,
    nextActionFrom: dateOnlyKeyToIso(range.startKey),
    nextActionTo: dateOnlyKeyToIso(range.endKey),
    sortBy: "nextActionDate",
    sortOrder: "asc",
  };

  return useQuery({
    queryKey: jobKeys.list(params),
    queryFn: ({ signal }) => getJobs(params, signal),
    placeholderData: keepPreviousData,
  });
}
