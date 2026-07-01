export type CalendarViewMode = "month" | "week" | "day";

export const CALENDAR_VIEW_MODES: readonly CalendarViewMode[] = [
  "month",
  "week",
  "day",
];

export function isCalendarViewMode(value: string): value is CalendarViewMode {
  return (CALENDAR_VIEW_MODES as readonly string[]).includes(value);
}

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  blockClassName: string;
  iconClassName: string;
};

export type CalendarMonthDay = {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
};
