import type { SelectOption } from "@/types/select-option.types";

export const CALENDAR_VIEW_OPTIONS: readonly SelectOption[] = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
];

export const CALENDAR_WEEKDAY_LABELS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

/**
 * The jobs API caps a page at 100 items. A single calendar range never spans
 * more than six weeks, so one page covers realistic volumes without paging.
 */
export const CALENDAR_EVENTS_PAGE_SIZE = 100;

/** Events shown in a month cell before collapsing the rest into "+N more". */
export const CALENDAR_MONTH_CELL_EVENT_LIMIT = 3;

export const CALENDAR_UPCOMING_EVENTS_LIMIT = 5;
