import { CalendarEventBlock } from "@/components/calendar/CalendarEventBlock";
import { CALENDAR_WEEKDAY_LABELS } from "@/constants/calendar.constants";
import { formatDateOnly } from "@/lib/date/date-only";
import { cn } from "@/lib/utils";

import type { CalendarDay, CalendarEvent } from "@/types/calendar.types";

type CalendarWeekViewProps = {
  days: CalendarDay[];
  eventsByDate: Map<string, CalendarEvent[]>;
  onSelectDate: (dateKey: string) => void;
};

export function CalendarWeekView({
  days,
  eventsByDate,
  onSelectDate,
}: CalendarWeekViewProps) {
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[42rem] grid-cols-7 gap-px overflow-hidden rounded-lg bg-border/60">
        {days.map((day, index) => {
          const dayEvents = eventsByDate.get(day.dateKey) ?? [];

          return (
            <div
              key={`day-${day.dateKey}`}
              className="flex min-h-64 flex-col bg-card"
            >
              <div className="border-b border-border/60 px-2 py-3 text-center">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {CALENDAR_WEEKDAY_LABELS[index]}
                </p>
                <button
                  type="button"
                  onClick={() => onSelectDate(day.dateKey)}
                  aria-label={`View ${formatDateOnly(day.dateKey)}`}
                  aria-current={day.isToday ? "date" : undefined}
                  className={cn(
                    "mt-1 inline-flex size-8 items-center justify-center rounded-full text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    day.isToday &&
                      "bg-primary font-semibold text-primary-foreground hover:bg-primary/90",
                  )}
                >
                  {day.dayNumber}
                </button>
              </div>

              {dayEvents.length > 0 ? (
                <ul className="space-y-1 p-2">
                  {dayEvents.map((event) => (
                    <li key={event.id}>
                      <CalendarEventBlock event={event} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-2 text-center text-xs text-muted-foreground">
                  No actions
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
