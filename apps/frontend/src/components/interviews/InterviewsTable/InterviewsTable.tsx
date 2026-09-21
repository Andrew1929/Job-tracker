import { InterviewTableRow } from "@/components/interviews/InterviewTableRow";
import { cn } from "@/lib/utils";

import type { Interview } from "@/types/interviews.types";

type InterviewsTableProps = {
  interviews: Interview[];
  onOpenDetails: (interview: Interview) => void;
  onEdit: (interview: Interview) => void;
  onDelete: (interview: Interview) => void;
  className?: string;
};

/**
 * Same table shell as `JobsTable`: a horizontally scrollable wrapper around a
 * minimum-width table, with the secondary columns dropping out first on narrow
 * screens. Date, role and status stay visible at every width.
 */
export function InterviewsTable({
  interviews,
  onOpenDetails,
  onEdit,
  onDelete,
  className,
}: InterviewsTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-border/60 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="pb-3 pr-4 font-medium">
              Date &amp; time
            </th>
            <th scope="col" className="pb-3 pr-4 font-medium">
              Role / Company
            </th>
            <th
              scope="col"
              className="hidden pb-3 pr-4 font-medium sm:table-cell"
            >
              Type
            </th>
            <th
              scope="col"
              className="hidden pb-3 pr-4 font-medium md:table-cell"
            >
              Mode
            </th>
            <th scope="col" className="pb-3 pr-4 font-medium">
              Status
            </th>
            <th scope="col" className="pb-3 text-right font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {interviews.map((interview) => (
            <InterviewTableRow
              key={interview.id}
              interview={interview}
              onOpenDetails={onOpenDetails}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
