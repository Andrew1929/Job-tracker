import { cn } from "@/lib/utils";
import { formatEventDate } from "@/lib/calendar/month-grid";

import type { CalendarEvent } from "@/types/calendar.types";

type CalendarEventItemProps = {
  event: CalendarEvent;
};

export function CalendarEventItem({ event }: CalendarEventItemProps) {
  return (
    <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <span
        className={cn("mt-1 size-3 shrink-0 rounded-sm", event.iconClassName)}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {event.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {formatEventDate(event.date)} · {event.time}
        </p>
      </div>
    </li>
  );
}
