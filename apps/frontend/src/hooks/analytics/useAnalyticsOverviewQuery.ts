"use client";

import { useQuery } from "@tanstack/react-query";

import { analyticsKeys } from "@/lib/query/query-keys";
import { getAnalyticsOverview } from "@/services/analytics.service";

export function useAnalyticsOverviewQuery() {
  return useQuery({
    queryKey: analyticsKeys.overview(),
    queryFn: ({ signal }) => getAnalyticsOverview(signal),
  });
}
