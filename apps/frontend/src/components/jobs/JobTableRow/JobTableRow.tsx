import { MoreVertical } from "lucide-react";

import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format/currency";

import type { JobListItem } from "@/types/jobs.types";

type JobTableRowProps = {
  job: JobListItem;
};

export function JobTableRow({ job }: JobTableRowProps) {
  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className="py-4 pr-4">
        <span className="text-sm font-semibold text-foreground">
          {job.company}
        </span>
      </td>
      <td className="py-4 pr-4 text-sm text-foreground">{job.position}</td>
      <td className="py-4 pr-4">
        <StatusBadge status={job.status} />
      </td>
      <td className="hidden py-4 pr-4 text-sm text-muted-foreground sm:table-cell">
        {job.appliedDate}
      </td>
      <td className="hidden py-4 pr-4 text-sm text-foreground md:table-cell">
        {formatCurrency(job.salary)}
      </td>
      <td className="py-4 text-right">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground"
          aria-label={`Actions for ${job.company} ${job.position}`}
        >
          <MoreVertical />
        </Button>
      </td>
    </tr>
  );
}
