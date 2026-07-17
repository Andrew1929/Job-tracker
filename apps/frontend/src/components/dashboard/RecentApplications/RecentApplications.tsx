import { FileText } from "lucide-react";
import Link from "next/link";

import { ApplicationRow } from "@/components/dashboard/ApplicationRow";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JOBS_ROUTES } from "@/constants/jobs.constants";
import { cn } from "@/lib/utils";

import type { RecentApplication } from "@/types/dashboard.types";

type RecentApplicationsProps = {
  applications: RecentApplication[];
  className?: string;
};

export function RecentApplications({
  applications,
  className,
}: RecentApplicationsProps) {
  return (
    <Card className={cn("rounded-xl shadow-sm", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Recent Applications
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto pt-0">
        {applications.length > 0 ? (
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="pb-3 pr-4 font-medium">
                  Company
                </th>
                <th
                  scope="col"
                  className="hidden pb-3 pr-4 font-medium sm:table-cell"
                >
                  Job Title
                </th>
                <th scope="col" className="pb-3 pr-4 font-medium">
                  Status
                </th>
                <th
                  scope="col"
                  className="hidden pb-3 font-medium md:table-cell"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <ApplicationRow key={application.id} application={application} />
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            description="Track a job and mark it as applied to see it here."
            action={
              <Link
                href={JOBS_ROUTES.list}
                className="rounded-sm text-sm font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Add a job
              </Link>
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
