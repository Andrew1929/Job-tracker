import { ANALYTICS_API_PATHS } from "@/constants/analytics.constants";
import { apiRequest } from "@/lib/api/api-client";
import type { AnalyticsOverview } from "@/types/analytics.types";

export function getAnalyticsOverview(
  signal?: AbortSignal,
): Promise<AnalyticsOverview> {
  return apiRequest<AnalyticsOverview>(ANALYTICS_API_PATHS.overview, { signal });
}
