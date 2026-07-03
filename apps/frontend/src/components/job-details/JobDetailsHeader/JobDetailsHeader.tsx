import { Pencil } from "lucide-react";

import { JobStatusSelect } from "@/components/job-details/JobStatusSelect";
import { ActionMenu } from "@/components/shared/ActionMenu";
import { CompanyAvatar } from "@/components/shared/CompanyAvatar";

import type { JobStatus } from "@/types/job-status.types";
import type { JobDetails } from "@/types/jobs.types";

type JobDetailsHeaderProps = {
  job: JobDetails;
  onStatusChange: (status: JobStatus) => void;
  onEdit: () => void;
};

export function JobDetailsHeader({
  job,
  onStatusChange,
  onEdit,
}: JobDetailsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <CompanyAvatar
          initial={job.companyInitial}
          colorClass={job.companyColor}
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {job.company}
          </h1>
          <p className="text-sm text-muted-foreground">{job.position}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <JobStatusSelect
          id="job-details-status"
          value={job.status}
          onChange={onStatusChange}
        />
        <ActionMenu
          triggerAriaLabel={`Actions for ${job.company} ${job.position}`}
          items={[
            {
              id: "edit",
              label: "Edit Details",
              icon: Pencil,
              onSelect: onEdit,
            },
          ]}
        />
      </div>
    </div>
  );
}
