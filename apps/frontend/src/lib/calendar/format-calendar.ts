import { startOfWeek, addDays } from "@/lib/calendar/calendar-dates";

import type { CalendarViewMode } from "@/types/calendar.types";

const DEFAULT_LOCALE = "en-US";
const RANGE_SEPARATOR = "–";

function format(
  date: Date,
  options: Intl.DateTimeFormatOptions,
  locale: string,
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function formatMonthYear(date: Date, locale: string): string {
  return format(date, { month: "long", year: "numeric" }, locale);
}

function formatFullDay(date: Date, locale: string): string {
  return format(
    date,
    { weekday: "long", month: "long", day: "numeric", year: "numeric" },
    locale,
  );
}

function formatWeekRange(date: Date, locale: string): string {
  const start = startOfWeek(date);
  const end = addDays(start, 6);

  const startMonth = format(start, { month: "long" }, locale);
  const endMonth = format(end, { month: "long" }, locale);

  if (start.getFullYear() !== end.getFullYear()) {
    return `${startMonth} ${start.getDate()}, ${start.getFullYear()} ${RANGE_SEPARATOR} ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
  }

  if (start.getMonth() === end.getMonth()) {
    return `${startMonth} ${start.getDate()} ${RANGE_SEPARATOR} ${end.getDate()}, ${end.getFullYear()}`;
  }

  return `${startMonth} ${start.getDate()} ${RANGE_SEPARATOR} ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
}

/** Human-readable title for the range the active view renders. */
export function formatCalendarRangeTitle(
  date: Date,
  view: CalendarViewMode,
  locale = DEFAULT_LOCALE,
): string {
  if (view === "day") {
    return formatFullDay(date, locale);
  }

  if (view === "week") {
    return formatWeekRange(date, locale);
  }

  return formatMonthYear(date, locale);
}
