"use client";

import { useMemo, useState } from "react";

import { CalendarDayView } from "@/components/calendar/CalendarDayView";
import { CalendarMonthView } from "@/components/calendar/CalendarMonthView";
import { CalendarSkeleton } from "@/components/calendar/CalendarSkeleton";
import { CalendarToolbar } from "@/components/calendar/CalendarToolbar";
import { CalendarWeekView } from "@/components/calendar/CalendarWeekView";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent } from "@/components/ui/card";
import { useCalendarEventsQuery } from "@/hooks/calendar";
import { getApiErrorMessage } from "@/lib/api/error-message";
import {
  buildDay,
  buildMonthDays,
  buildWeekDays,
  getVisibleRange,
  parseDateKey,
  shiftDate,
  startOfToday,
} from "@/lib/calendar/calendar-dates";
import { formatCalendarRangeTitle } from "@/lib/calendar/format-calendar";
import {
  groupEventsByDateKey,
  mapJobsToCalendarEvents,
} from "@/lib/calendar/map-calendar-events";
import { todayDateOnlyKey } from "@/lib/date/date-only";
import { cn } from "@/lib/utils";

import type { CalendarViewMode } from "@/types/calendar.types";

type CalendarContentProps = {
  className?: string;
};

export function CalendarContent({ className }: CalendarContentProps) {
  const [view, setView] = useState<CalendarViewMode>("month");
  const [focusedDate, setFocusedDate] = useState(startOfToday);

  // Recomputed per render so the "today" highlight stays correct if the app is
  // left open across midnight.
  const todayKey = todayDateOnlyKey();

  const range = getVisibleRange(focusedDate, view);
  const eventsQuery = useCalendarEventsQuery(range);

  // The only derivation worth memoising: it sorts a full page of jobs and
  // builds a Map, which would otherwise be repeated on every render rather than
  // only when the data changes. Cells then look their events up in O(1).
  const eventsByDate = useMemo(
    () =>
      groupEventsByDateKey(
        mapJobsToCalendarEvents(eventsQuery.data?.items ?? []),
      ),
    [eventsQuery.data],
  );

  const selectDate = (dateKey: string) => {
    setFocusedDate(parseDateKey(dateKey));
    setView("day");
  };

  const renderView = () => {
    if (view === "month") {
      return (
        <CalendarMonthView
          days={buildMonthDays(focusedDate, todayKey)}
          eventsByDate={eventsByDate}
          onSelectDate={selectDate}
        />
      );
    }

    if (view === "week") {
      return (
        <CalendarWeekView
          days={buildWeekDays(focusedDate, todayKey)}
          eventsByDate={eventsByDate}
          onSelectDate={selectDate}
        />
      );
    }

    const day = buildDay(focusedDate, todayKey);

    return (
      <CalendarDayView day={day} events={eventsByDate.get(day.dateKey) ?? []} />
    );
  };

  const renderBody = () => {
    if (eventsQuery.isLoading) {
      return <CalendarSkeleton view={view} />;
    }

    if (eventsQuery.isError) {
      return (
        <ErrorState
          message={getApiErrorMessage(eventsQuery.error)}
          onRetry={() => void eventsQuery.refetch()}
          isRetrying={eventsQuery.isFetching}
        />
      );
    }

    return (
      <div
        className={cn(
          "flex flex-1 flex-col space-y-4 transition-opacity",
          eventsQuery.isFetching && "opacity-60",
        )}
        aria-busy={eventsQuery.isFetching}
      >
        {renderView()}

        {/* The grid always stays mounted so navigation keeps working on an
            empty range; the day view carries its own empty state. */}
        {view !== "day" && eventsByDate.size === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No scheduled actions in this range.
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <Card className={cn("flex-1", className)}>
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <CalendarToolbar
          title={formatCalendarRangeTitle(focusedDate, view)}
          view={view}
          onViewChange={setView}
          onPrevious={() => setFocusedDate((date) => shiftDate(date, view, -1))}
          onNext={() => setFocusedDate((date) => shiftDate(date, view, 1))}
          onToday={() => setFocusedDate(startOfToday())}
        />

        {renderBody()}
      </CardContent>
    </Card>
  );
}
