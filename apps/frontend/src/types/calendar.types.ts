import type { JobStatus } from "@/types/jobs.types";

export type CalendarViewMode = "month" | "week" | "day";

export const CALENDAR_VIEW_MODES: readonly CalendarViewMode[] = [
  "month",
  "week",
  "day",
];

export function isCalendarViewMode(value: string): value is CalendarViewMode {
  return (CALENDAR_VIEW_MODES as readonly string[]).includes(value);
}

/**
 * A scheduled action rendered by the calendar views.
 *
 * Sourced today from `Job.nextActionDate`, but deliberately decoupled from the
 * jobs API response: views never read a `Job`, so another scheduled entity can
 * be mapped into this shape later without touching the views.
 *
 * `dateKey` is the `YYYY-MM-DD` calendar date, not an instant, because the
 * underlying field carries no time of day.
 */
export type CalendarEvent = {
  id: string;
  jobId: string;
  title: string;
  companyName: string | null;
  status: JobStatus;
  dateKey: string;
};

export type CalendarDay = {
  dateKey: string;
  dayNumber: number;
  isToday: boolean;
};

export type CalendarMonthDay = CalendarDay & {
  isCurrentMonth: boolean;
};

/** Inclusive range of calendar dates a view renders. */
export type CalendarDateRange = {
  startKey: string;
  endKey: string;
};
