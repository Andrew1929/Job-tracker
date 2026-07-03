import { Eye, Pencil } from "lucide-react";

import { ActionMenu } from "@/components/shared/ActionMenu";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { JOBS_ROUTES } from "@/constants/jobs.constants";
import { formatCurrency } from "@/lib/format/currency";

import type { JobListItem } from "@/types/jobs.types";

type JobTableRowProps = {
  job: JobListItem;
  onEdit: (job: JobListItem) => void;
};

export function JobTableRow({ job, onEdit }: JobTableRowProps) {
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
        <ActionMenu
          triggerAriaLabel={`Actions for ${job.company} ${job.position}`}
          items={[
            {
              id: "view",
              label: "View Details",
              icon: Eye,
              href: JOBS_ROUTES.details(job.id),
            },
            {
              id: "edit",
              label: "Edit Details",
              icon: Pencil,
              onSelect: () => onEdit(job),
            },
          ]}
        />
      </td>
    </tr>
  );
}
