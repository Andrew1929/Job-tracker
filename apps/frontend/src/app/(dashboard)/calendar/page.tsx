import { CalendarContent } from "@/components/calendar/CalendarContent";
import { CalendarLegend } from "@/components/calendar/CalendarLegend";
import { UpcomingEventsSidebar } from "@/components/calendar/UpcomingEventsSidebar";

export default function CalendarPage() {
  return (
    <div className="grid min-h-full gap-6 xl:grid-cols-3">
      <div className="flex min-h-0 flex-col gap-6 xl:col-span-2">
        <CalendarContent />

        <CalendarLegend />
      </div>

      <UpcomingEventsSidebar className="h-full" />
    </div>
  );
}
