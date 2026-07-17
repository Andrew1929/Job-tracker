"use client";

import { ApplicationsChart } from "@/components/dashboard/ApplicationsChart";
import { RecentApplications } from "@/components/dashboard/RecentApplications";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { UpcomingInterviews } from "@/components/dashboard/UpcomingInterviews";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/Skeleton";
import {
  DASHBOARD_RECENT_APPLICATIONS_LIMIT,
  DASHBOARD_UPCOMING_INTERVIEWS_LIMIT,
} from "@/constants/dashboard.constants";
import { DEFAULT_JOBS_QUERY } from "@/constants/jobs.constants";
import { useAnalyticsOverviewQuery } from "@/hooks/analytics";
import { useJobsQuery } from "@/hooks/jobs";
import { getApiErrorMessage } from "@/lib/api/error-message";
import {
  mapApplicationsSeries,
  mapRecentApplications,
  mapSummaryToDashboardStats,
  mapUpcomingInterviews,
} from "@/lib/dashboard/map-dashboard";
import { cn } from "@/lib/utils";

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <Skeleton className="h-8 w-40" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Skeleton className="h-80 rounded-xl xl:col-span-2" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export function DashboardContent() {
  const analyticsQuery = useAnalyticsOverviewQuery();
  const jobsQuery = useJobsQuery(DEFAULT_JOBS_QUERY);

  if (analyticsQuery.isLoading || jobsQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  if (analyticsQuery.isError || jobsQuery.isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <ErrorState
          message={getApiErrorMessage(analyticsQuery.error ?? jobsQuery.error)}
          onRetry={() => {
            void analyticsQuery.refetch();
            void jobsQuery.refetch();
          }}
          isRetrying={analyticsQuery.isFetching || jobsQuery.isFetching}
        />
      </div>
    );
  }

  const overview = analyticsQuery.data;
  if (!overview) {
    return null;
  }

  const jobs = jobsQuery.data?.items ?? [];
  const isRefreshing = analyticsQuery.isFetching || jobsQuery.isFetching;

  const stats = mapSummaryToDashboardStats(overview.summary);
  const applicationsSeries = mapApplicationsSeries(overview.applicationsOverTime);
  const recentApplications = mapRecentApplications(
    jobs,
    DASHBOARD_RECENT_APPLICATIONS_LIMIT,
  );
  const upcomingInterviews = mapUpcomingInterviews(
    jobs,
    new Date(),
    DASHBOARD_UPCOMING_INTERVIEWS_LIMIT,
  );

  return (
    <div
      className={cn("space-y-6 transition-opacity", isRefreshing && "opacity-70")}
      aria-busy={isRefreshing}
    >
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Dashboard
      </h1>

      <StatsCards stats={stats} />

      <div className="grid gap-6 xl:grid-cols-3">
        <ApplicationsChart className="xl:col-span-2" data={applicationsSeries} />
        <UpcomingInterviews interviews={upcomingInterviews} />
      </div>

      <RecentApplications applications={recentApplications} />
    </div>
  );
}
