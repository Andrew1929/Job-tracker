import type { CalendarEvent } from "@/types/calendar.types";
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

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Google Interview",
    date: "2026-05-15",
    time: "10:00 AM",
    blockClassName: "bg-violet-100 text-violet-800",
    iconClassName: "bg-violet-500",
  },
  {
    id: "2",
    title: "Amazon Call",
    date: "2026-05-17",
    time: "2:00 PM",
    blockClassName: "bg-rose-100 text-rose-800",
    iconClassName: "bg-orange-500",
  },
  {
    id: "3",
    title: "Stripe Interview",
    date: "2026-05-19",
    time: "11:00 AM",
    blockClassName: "bg-violet-100 text-violet-800",
    iconClassName: "bg-emerald-500",
  },
  {
    id: "4",
    title: "Microsoft Interview",
    date: "2026-05-22",
    time: "3:00 PM",
    blockClassName: "bg-violet-100 text-violet-800",
    iconClassName: "bg-violet-500",
  },
  {
    id: "5",
    title: "Follow-up",
    date: "2026-05-26",
    time: "9:00 AM",
    blockClassName: "bg-sky-100 text-sky-800",
    iconClassName: "bg-emerald-500",
  },
];

export const CALENDAR_DEFAULT_MONTH = new Date(2026, 4, 1);
