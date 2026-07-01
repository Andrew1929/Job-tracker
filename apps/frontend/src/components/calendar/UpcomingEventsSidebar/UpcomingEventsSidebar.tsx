import Link from "next/link";

import { CalendarEventItem } from "@/components/calendar/CalendarEventItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_CALENDAR_EVENTS } from "@/constants/calendar.constants";
import { cn } from "@/lib/utils";

type UpcomingEventsSidebarProps = {
  className?: string;
};

export function UpcomingEventsSidebar({
  className,
}: UpcomingEventsSidebarProps) {
  return (
    <Card className={cn("rounded-xl shadow-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="divide-y divide-border/60">
          {MOCK_CALENDAR_EVENTS.map((event) => (
            <CalendarEventItem key={event.id} event={event} />
          ))}
        </ul>

        <Link
          href="#"
          className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
        >
          View all events
        </Link>
      </CardContent>
    </Card>
  );
}
