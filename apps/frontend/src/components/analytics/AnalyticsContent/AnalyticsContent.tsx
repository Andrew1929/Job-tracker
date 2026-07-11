"use client";

import { AnalyticsInsights } from "@/components/analytics/AnalyticsInsights";
import { AnalyticsMetrics } from "@/components/analytics/AnalyticsMetrics";
import { ApplicationsOverTimeChart } from "@/components/analytics/ApplicationsOverTimeChart";
import { ConversionFunnel } from "@/components/analytics/ConversionFunnel";
import { JobsByStatusChart } from "@/components/analytics/JobsByStatusChart";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/Skeleton";
import { useAnalyticsOverviewQuery } from "@/hooks/analytics";
import { getApiErrorMessage } from "@/lib/api/error-message";
import {
  mapConversionFunnel,
  mapStatusDistribution,
  mapSummaryToMetrics,
} from "@/lib/analytics/map-analytics";
import { cn } from "@/lib/utils";

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading analytics">
      <Skeleton className="h-8 w-40" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid min-w-0 gap-6 xl:grid-cols-3">
        <Skeleton className="h-80 rounded-xl xl:col-span-2" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
      <div className="grid min-w-0 gap-6 xl:grid-cols-3">
        <Skeleton className="h-72 rounded-xl xl:col-span-2" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}

export function AnalyticsContent() {
  const analyticsQuery = useAnalyticsOverviewQuery();

  if (analyticsQuery.isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (analyticsQuery.isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Analytics
        </h1>
        <ErrorState
          message={getApiErrorMessage(analyticsQuery.error)}
          onRetry={() => void analyticsQuery.refetch()}
          isRetrying={analyticsQuery.isFetching}
        />
      </div>
    );
  }

  const overview = analyticsQuery.data;
  if (!overview) {
    return null;
  }

  const metrics = mapSummaryToMetrics(overview.summary);
  const statusDistribution = mapStatusDistribution(overview.statusDistribution);
  const funnelStages = mapConversionFunnel(overview.conversionFunnel);

  return (
    <div
      className={cn(
        "min-w-0 space-y-6 transition-opacity",
        analyticsQuery.isFetching && "opacity-70",
      )}
      aria-busy={analyticsQuery.isFetching}
    >
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Analytics
      </h1>

      <AnalyticsMetrics metrics={metrics} />

      <div className="grid min-w-0 gap-6 xl:grid-cols-3">
        <ApplicationsOverTimeChart
          className="min-w-0 xl:col-span-2"
          data={overview.applicationsOverTime}
        />
        <JobsByStatusChart
          className="min-w-0"
          total={statusDistribution.total}
          segments={statusDistribution.segments}
        />
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-3">
        <ConversionFunnel
          className="min-w-0 xl:col-span-2"
          stages={funnelStages}
        />
        <AnalyticsInsights
          className="min-w-0"
          insights={overview.insights}
        />
      </div>
    </div>
  );
}
