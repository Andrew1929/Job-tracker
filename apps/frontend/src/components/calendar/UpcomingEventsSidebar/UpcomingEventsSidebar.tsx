"use client";

import { useMemo } from "react";

import { CalendarEventItem } from "@/components/calendar/CalendarEventItem";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/Skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CALENDAR_UPCOMING_EVENTS_LIMIT } from "@/constants/calendar.constants";
import { useUpcomingEventsQuery } from "@/hooks/calendar/useUpcomingEventsQuery";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { mapJobsToCalendarEvents } from "@/lib/calendar/map-calendar-events";
import { todayDateOnlyKey } from "@/lib/date/date-only";
import { cn } from "@/lib/utils";

type UpcomingEventsSidebarProps = {
  className?: string;
};

function UpcomingEventsSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      {Array.from({ length: CALENDAR_UPCOMING_EVENTS_LIMIT }).map((_, index) => (
        <div key={`upcoming-row-${index}`} className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function UpcomingEventsSidebar({ className }: UpcomingEventsSidebarProps) {
  const upcomingQuery = useUpcomingEventsQuery(todayDateOnlyKey());

  const events = useMemo(
    () => mapJobsToCalendarEvents(upcomingQuery.data?.items ?? []),
    [upcomingQuery.data],
  );

  const renderBody = () => {
    if (upcomingQuery.isLoading) {
      return <UpcomingEventsSkeleton />;
    }

    if (upcomingQuery.isError) {
      return (
        <ErrorState
          message={getApiErrorMessage(upcomingQuery.error)}
          onRetry={() => void upcomingQuery.refetch()}
          isRetrying={upcomingQuery.isFetching}
          className="py-8"
        />
      );
    }

    if (events.length === 0) {
      return (
        <p className="py-6 text-sm text-muted-foreground">
          No upcoming actions scheduled.
        </p>
      );
    }

    return (
      <ul className="divide-y divide-border/60">
        {events.map((event) => (
          <CalendarEventItem key={event.id} event={event} />
        ))}
      </ul>
    );
  };

  return (
    <Card className={cn("rounded-xl shadow-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{renderBody()}</CardContent>
    </Card>
  );
}
