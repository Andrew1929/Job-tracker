import { CalendarClock } from "lucide-react";
import Link from "next/link";

import { InterviewItem } from "@/components/dashboard/InterviewItem";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JOBS_ROUTES } from "@/constants/jobs.constants";

import type { UpcomingInterview } from "@/types/dashboard.types";

type UpcomingInterviewsProps = {
  interviews: UpcomingInterview[];
};

export function UpcomingInterviews({ interviews }: UpcomingInterviewsProps) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Upcoming Interviews
        </CardTitle>
        <Link
          href={JOBS_ROUTES.list}
          className="rounded-sm text-sm font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="pt-2">
        {interviews.length > 0 ? (
          <ul className="divide-y divide-border/60">
            {interviews.map((interview) => (
              <InterviewItem key={interview.id} interview={interview} />
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={CalendarClock}
            title="No upcoming interviews"
            description="Interviews with a scheduled date will show up here."
          />
        )}
      </CardContent>
    </Card>
  );
}
