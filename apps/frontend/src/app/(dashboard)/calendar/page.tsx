import { CalendarContent } from "@/components/calendar/CalendarContent";
import { UpcomingEventsSidebar } from "@/components/calendar/UpcomingEventsSidebar";

export default function CalendarPage() {
  return (
    <div className="grid min-h-full gap-6 xl:grid-cols-3">
      <CalendarContent className="flex flex-col xl:col-span-2" />
      <UpcomingEventsSidebar className="flex flex-col" />
    </div>
  );
}
