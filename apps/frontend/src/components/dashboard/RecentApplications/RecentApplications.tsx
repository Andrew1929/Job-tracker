import { ApplicationRow } from "@/components/dashboard/ApplicationRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RECENT_APPLICATIONS } from "@/constants/dashboard.constants";
import { cn } from "@/lib/utils";

type RecentApplicationsProps = {
  className?: string;
};

export function RecentApplications({ className }: RecentApplicationsProps) {
  return (
    <Card className={cn("rounded-xl shadow-sm", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Recent Applications
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto pt-0">
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
            {RECENT_APPLICATIONS.map((application) => (
              <ApplicationRow key={application.id} application={application} />
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
