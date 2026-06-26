import Link from "next/link";

import { InterviewItem } from "@/components/dashboard/InterviewItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UPCOMING_INTERVIEWS } from "@/constants/dashboard.constants";

export function UpcomingInterviews() {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Upcoming Interviews
        </CardTitle>
        <Link
          href="#"
          className="text-sm font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="pt-2">
        <ul className="divide-y divide-border/60">
          {UPCOMING_INTERVIEWS.map((interview) => (
            <InterviewItem key={interview.id} interview={interview} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
