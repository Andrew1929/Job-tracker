import { CalendarContent } from "@/components/calendar/CalendarContent";
import { UpcomingEventsSidebar } from "@/components/calendar/UpcomingEventsSidebar";

export default function CalendarPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <CalendarContent className="xl:col-span-2" />
      <UpcomingEventsSidebar />
    </div>
  );
}
