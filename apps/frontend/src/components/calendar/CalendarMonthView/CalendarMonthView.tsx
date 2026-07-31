import { CalendarEventBlock } from "@/components/calendar/CalendarEventBlock";
import {
  CALENDAR_MONTH_CELL_EVENT_LIMIT,
  CALENDAR_WEEKDAY_LABELS,
} from "@/constants/calendar.constants";
import { formatDateOnly } from "@/lib/date/date-only";
import { cn } from "@/lib/utils";

import type { CalendarEvent, CalendarMonthDay } from "@/types/calendar.types";

type CalendarMonthViewProps = {
  days: CalendarMonthDay[];
  eventsByDate: Map<string, CalendarEvent[]>;
  onSelectDate: (dateKey: string) => void;
};

export function CalendarMonthView({
  days,
  eventsByDate,
  onSelectDate,
}: CalendarMonthViewProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[42rem]">
        <div className="grid grid-cols-7">
          {CALENDAR_WEEKDAY_LABELS.map((label) => (
            <div
              key={`weekday-${label}`}
              className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-border/60">
          {days.map((day) => {
            const dayEvents = eventsByDate.get(day.dateKey) ?? [];
            const visibleEvents = dayEvents.slice(
              0,
              CALENDAR_MONTH_CELL_EVENT_LIMIT,
            );
            const hiddenCount = dayEvents.length - visibleEvents.length;

            return (
              <div
                key={`day-${day.dateKey}`}
                className={cn(
                  "min-h-28 p-2",
                  day.isCurrentMonth ? "bg-card" : "bg-muted/30",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectDate(day.dateKey)}
                  aria-label={`View ${formatDateOnly(day.dateKey)}`}
                  aria-current={day.isToday ? "date" : undefined}
                  className={cn(
                    "inline-flex size-7 items-center justify-center rounded-full text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    day.isCurrentMonth
                      ? "text-foreground"
                      : "text-muted-foreground",
                    day.isToday &&
                      "bg-primary font-semibold text-primary-foreground hover:bg-primary/90",
                  )}
                >
                  {day.dayNumber}
                </button>

                <div className="mt-1 space-y-1">
                  {visibleEvents.map((event) => (
                    <CalendarEventBlock key={event.id} event={event} />
                  ))}

                  {hiddenCount > 0 ? (
                    <button
                      type="button"
                      onClick={() => onSelectDate(day.dateKey)}
                      className="w-full rounded-md px-2 py-0.5 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      +{hiddenCount} more
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
