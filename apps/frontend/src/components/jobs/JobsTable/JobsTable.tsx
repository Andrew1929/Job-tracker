import { JobTableRow } from "@/components/jobs/JobTableRow";
import { cn } from "@/lib/utils";

import type { JobListItem } from "@/types/jobs.types";

type JobsTableProps = {
  jobs: JobListItem[];
  className?: string;
};

export function JobsTable({ jobs, className }: JobsTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-border/60 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="pb-3 pr-4 font-medium">
              Company
            </th>
            <th scope="col" className="pb-3 pr-4 font-medium">
              Position
            </th>
            <th scope="col" className="pb-3 pr-4 font-medium">
              Status
            </th>
            <th
              scope="col"
              className="hidden pb-3 pr-4 font-medium sm:table-cell"
            >
              Applied
            </th>
            <th
              scope="col"
              className="hidden pb-3 pr-4 font-medium md:table-cell"
            >
              Salary
            </th>
            <th scope="col" className="pb-3 text-right font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <JobTableRow key={job.id} job={job} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
