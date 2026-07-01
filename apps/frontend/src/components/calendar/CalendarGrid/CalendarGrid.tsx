import { CalendarEventBlock } from "@/components/calendar/CalendarEventBlock";
import { CALENDAR_WEEKDAY_LABELS } from "@/constants/calendar.constants";
import { buildMonthGrid } from "@/lib/calendar/month-grid";
import { cn } from "@/lib/utils";

import type { CalendarEvent } from "@/types/calendar.types";

type CalendarGridProps = {
  year: number;
  month: number;
  events: CalendarEvent[];
};

function groupEventsByDate(
  events: CalendarEvent[],
): Record<string, CalendarEvent[]> {
  return events.reduce<Record<string, CalendarEvent[]>>((grouped, event) => {
    const existing = grouped[event.date] ?? [];
    grouped[event.date] = [...existing, event];
    return grouped;
  }, {});
}

export function CalendarGrid({ year, month, events }: CalendarGridProps) {
  const days = buildMonthGrid(year, month);
  const eventsByDate = groupEventsByDate(events);

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-border/60">
        {CALENDAR_WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayEvents = eventsByDate[day.date] ?? [];

          return (
            <div
              key={day.date}
              className={cn(
                "min-h-28 border-b border-r border-border/60 p-2 last:border-r-0",
                !day.isCurrentMonth && "bg-muted/30",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-full text-sm",
                  day.isCurrentMonth
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {day.dayNumber}
              </span>

              <div className="mt-1 space-y-1">
                {dayEvents.map((event) => (
                  <CalendarEventBlock key={event.id} event={event} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
