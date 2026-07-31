import { Skeleton } from "@/components/shared/Skeleton";

import type { CalendarViewMode } from "@/types/calendar.types";

type CalendarSkeletonProps = {
  view: CalendarViewMode;
};

const MONTH_CELL_COUNT = 35;
const WEEK_COLUMN_COUNT = 7;
const DAY_ROW_COUNT = 3;

/** Placeholders mirror the active view so the layout does not jump on load. */
export function CalendarSkeleton({ view }: CalendarSkeletonProps) {
  if (view === "day") {
    return (
      <div className="space-y-2 rounded-lg border border-border/60 p-4" aria-hidden="true">
        {Array.from({ length: DAY_ROW_COUNT }).map((_, index) => (
          <Skeleton key={`day-row-${index}`} className="h-16 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (view === "week") {
    return (
      <div
        className="grid min-h-64 grid-cols-7 gap-px overflow-hidden rounded-lg bg-border/60"
        aria-hidden="true"
      >
        {Array.from({ length: WEEK_COLUMN_COUNT }).map((_, index) => (
          <div key={`week-column-${index}`} className="space-y-2 bg-card p-2">
            <Skeleton className="mx-auto h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-full rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-border/60"
      aria-hidden="true"
    >
      {Array.from({ length: MONTH_CELL_COUNT }).map((_, index) => (
        <div key={`month-cell-${index}`} className="min-h-28 space-y-2 bg-card p-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-5 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}
