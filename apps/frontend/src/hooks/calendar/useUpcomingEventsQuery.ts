"use client";

import { useQuery } from "@tanstack/react-query";

import { CALENDAR_UPCOMING_EVENTS_LIMIT } from "@/constants/calendar.constants";
import { dateOnlyKeyToIso } from "@/lib/date/date-only";
import { jobKeys } from "@/lib/query/query-keys";
import { getJobs } from "@/services/jobs.service";

import type { JobsQueryParams } from "@/types/jobs.types";

/**
 * Next scheduled actions from `fromDateKey` onwards. This is a separate query
 * from the calendar grid because "upcoming" is anchored to today, not to the
 * range the user happens to be browsing.
 */
export function useUpcomingEventsQuery(fromDateKey: string) {
  const params: JobsQueryParams = {
    page: 1,
    limit: CALENDAR_UPCOMING_EVENTS_LIMIT,
    nextActionFrom: dateOnlyKeyToIso(fromDateKey),
    sortBy: "nextActionDate",
    sortOrder: "asc",
  };

  return useQuery({
    queryKey: jobKeys.list(params),
    queryFn: ({ signal }) => getJobs(params, signal),
  });
}
