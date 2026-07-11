import { Eye, Pencil, Trash2 } from "lucide-react";

import { JobPriorityBadge } from "@/components/jobs/JobPriorityBadge";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { ActionMenu } from "@/components/shared/ActionMenu";
import { JOBS_ROUTES } from "@/constants/jobs.constants";
import { formatDateValue } from "@/lib/format/date";

import type { Job } from "@/types/jobs.types";

type JobTableRowProps = {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
};

export function JobTableRow({ job, onEdit, onDelete }: JobTableRowProps) {
  const companyName = job.company?.name ?? "—";

  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className="py-4 pr-4 text-sm font-semibold text-foreground">
        {job.title}
      </td>
      <td className="py-4 pr-4 text-sm text-foreground">{companyName}</td>
      <td className="py-4 pr-4">
        <JobStatusBadge status={job.status} />
      </td>
      <td className="hidden py-4 pr-4 md:table-cell">
        <JobPriorityBadge priority={job.priority} />
      </td>
      <td className="hidden py-4 pr-4 text-sm text-muted-foreground sm:table-cell">
        {formatDateValue(job.appliedAt)}
      </td>
      <td className="py-4 text-right">
        <ActionMenu
          triggerAriaLabel={`Actions for ${job.title}`}
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
            {
              id: "delete",
              label: "Delete",
              icon: Trash2,
              onSelect: () => onDelete(job),
            },
          ]}
        />
      </td>
    </tr>
  );
}
