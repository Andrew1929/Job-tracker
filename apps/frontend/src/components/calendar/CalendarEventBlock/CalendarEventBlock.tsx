import { cn } from "@/lib/utils";

import type { CalendarEvent } from "@/types/calendar.types";

type CalendarEventBlockProps = {
  event: CalendarEvent;
};

export function CalendarEventBlock({ event }: CalendarEventBlockProps) {
  return (
    <div
      className={cn(
        "rounded-md px-2 py-1 text-xs font-medium",
        event.blockClassName,
      )}
    >
      <p className="truncate">{event.title}</p>
      <p className="truncate opacity-80">{event.time}</p>
    </div>
  );
}
