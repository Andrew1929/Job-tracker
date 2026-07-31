import { CalendarDays } from "lucide-react";

import { CalendarEventBlock } from "@/components/calendar/CalendarEventBlock";
import { EmptyState } from "@/components/shared/EmptyState";

import type { CalendarDay, CalendarEvent } from "@/types/calendar.types";

type CalendarDayViewProps = {
  day: CalendarDay;
  events: CalendarEvent[];
};

function formatActionCount(count: number): string {
  return count === 1 ? "1 scheduled action" : `${count} scheduled actions`;
}

export function CalendarDayView({ day, events }: CalendarDayViewProps) {
  return (
    <div className="rounded-lg border border-border/60">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {formatActionCount(events.length)}
        </p>
        {day.isToday ? (
          <span className="inline-flex items-center rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
            Today
          </span>
        ) : null}
      </div>

      {events.length > 0 ? (
        <ul className="space-y-2 p-4">
          {events.map((event) => (
            <li key={event.id}>
              <CalendarEventBlock event={event} variant="detailed" />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title="Nothing scheduled"
          description="No job has a next action planned for this day."
        />
      )}
    </div>
  );
}
