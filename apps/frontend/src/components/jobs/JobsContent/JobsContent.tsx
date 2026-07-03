"use client";

import { useState } from "react";

import { JobFormDrawer } from "@/components/jobs/JobFormDrawer";
import { JobsHeader } from "@/components/jobs/JobsHeader";
import { JobsList } from "@/components/jobs/JobsList";
import { findMockJobDetails, MOCK_JOBS } from "@/constants/jobs.constants";
import { formatFullDate } from "@/lib/format/date";

import type { JobFormValues } from "@/lib/validations/job.schema";
import type { JobListItem } from "@/types/jobs.types";

type JobFormState =
  | { mode: "create" }
  | { mode: "edit"; job: JobListItem }
  | null;

function toJobFormValues(job: JobListItem): JobFormValues {
  const details = findMockJobDetails(job.id);

  return {
    company: job.company,
    position: job.position,
    status: job.status,
    salary: String(job.salary),
    jobPostingUrl: details?.jobPostingUrl ?? "",
    location: details?.location ?? "",
    notes: details?.notes.join("\n") ?? "",
  };
}

export function JobsContent() {
  const [jobs, setJobs] = useState<JobListItem[]>(() => [...MOCK_JOBS]);
  const [formState, setFormState] = useState<JobFormState>(null);

  const closeForm = () => setFormState(null);

  const handleFormSubmit = (values: JobFormValues) => {
    if (!formState) {
      return;
    }

    if (formState.mode === "create") {
      const newJob: JobListItem = {
        id: crypto.randomUUID(),
        company: values.company,
        position: values.position,
        status: values.status,
        appliedDate: formatFullDate(new Date()),
        salary: Number(values.salary),
      };
      setJobs((previous) => [newJob, ...previous]);
    } else {
      const editedJobId = formState.job.id;
      setJobs((previous) =>
        previous.map((job) =>
          job.id === editedJobId
            ? {
                ...job,
                company: values.company,
                position: values.position,
                status: values.status,
                salary: Number(values.salary),
              }
            : job,
        ),
      );
    }

    closeForm();
  };

  return (
    <div className="space-y-6">
      <JobsHeader onAddJob={() => setFormState({ mode: "create" })} />
      <JobsList
        jobs={jobs}
        onEditJob={(job) => setFormState({ mode: "edit", job })}
      />

      {formState ? (
        <JobFormDrawer
          mode={formState.mode}
          initialValues={
            formState.mode === "edit"
              ? toJobFormValues(formState.job)
              : undefined
          }
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      ) : null}
    </div>
  );
}
