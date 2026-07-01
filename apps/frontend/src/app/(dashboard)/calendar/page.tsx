import { CalendarPanel } from "@/components/calendar/CalendarPanel";
import { UpcomingEventsSidebar } from "@/components/calendar/UpcomingEventsSidebar";

export default function CalendarPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <CalendarPanel className="xl:col-span-2" />
      <UpcomingEventsSidebar />
    </div>
  );
}
