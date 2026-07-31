import { toLocalDateOnlyKey } from "@/lib/date/date-only";

import type {
  CalendarDateRange,
  CalendarDay,
  CalendarMonthDay,
  CalendarViewMode,
} from "@/types/calendar.types";

const DAYS_PER_WEEK = 7;

/**
 * The focused date and the grid cells are the user's wall-clock days, so their
 * keys come from local components. Stored event values are date-only and are
 * keyed from UTC components by `toDateOnlyKey`; both paths yield the calendar
 * date the user means, which is what makes the two comparable.
 */
export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

/**
 * Clamps to the last day of the target month so navigating from the 31st never
 * skips a month.
 */
export function addMonths(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const daysInTargetMonth = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate();

  return new Date(
    target.getFullYear(),
    target.getMonth(),
    Math.min(date.getDate(), daysInTargetMonth),
  );
}

/** Weeks start on Monday, matching `CALENDAR_WEEKDAY_LABELS`. */
export function startOfWeek(date: Date): Date {
  const offsetFromMonday = (date.getDay() + 6) % DAYS_PER_WEEK;
  return addDays(date, -offsetFromMonday);
}

function toCalendarDay(date: Date, todayKey: string): CalendarDay {
  const dateKey = toLocalDateOnlyKey(date);

  return {
    dateKey,
    dayNumber: date.getDate(),
    isToday: dateKey === todayKey,
  };
}

function startOfMonthGrid(date: Date): Date {
  return startOfWeek(new Date(date.getFullYear(), date.getMonth(), 1));
}

/**
 * Number of whole weeks needed to cover the month plus its leading and trailing
 * days, so a month never renders an entirely out-of-month trailing row.
 */
function monthGridLength(date: Date): number {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const leadingDays = (firstOfMonth.getDay() + 6) % DAYS_PER_WEEK;
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate();

  return Math.ceil((leadingDays + daysInMonth) / DAYS_PER_WEEK) * DAYS_PER_WEEK;
}

export function buildMonthDays(
  date: Date,
  todayKey: string,
): CalendarMonthDay[] {
  const gridStart = startOfMonthGrid(date);
  const month = date.getMonth();

  return Array.from({ length: monthGridLength(date) }, (_, index) => {
    const day = addDays(gridStart, index);

    return {
      ...toCalendarDay(day, todayKey),
      isCurrentMonth: day.getMonth() === month,
    };
  });
}

export function buildWeekDays(date: Date, todayKey: string): CalendarDay[] {
  const weekStart = startOfWeek(date);

  return Array.from({ length: DAYS_PER_WEEK }, (_, index) =>
    toCalendarDay(addDays(weekStart, index), todayKey),
  );
}

export function buildDay(date: Date, todayKey: string): CalendarDay {
  return toCalendarDay(date, todayKey);
}

/** Inclusive range of calendar dates the given view renders. */
export function getVisibleRange(
  date: Date,
  view: CalendarViewMode,
): CalendarDateRange {
  if (view === "day") {
    const dateKey = toLocalDateOnlyKey(date);
    return { startKey: dateKey, endKey: dateKey };
  }

  if (view === "week") {
    const weekStart = startOfWeek(date);
    return {
      startKey: toLocalDateOnlyKey(weekStart),
      endKey: toLocalDateOnlyKey(addDays(weekStart, DAYS_PER_WEEK - 1)),
    };
  }

  const gridStart = startOfMonthGrid(date);

  return {
    startKey: toLocalDateOnlyKey(gridStart),
    endKey: toLocalDateOnlyKey(addDays(gridStart, monthGridLength(date) - 1)),
  };
}

/** Moves the focused date by one unit of the active view. */
export function shiftDate(
  date: Date,
  view: CalendarViewMode,
  direction: -1 | 1,
): Date {
  if (view === "month") {
    return addMonths(date, direction);
  }

  return addDays(date, view === "week" ? direction * DAYS_PER_WEEK : direction);
}
