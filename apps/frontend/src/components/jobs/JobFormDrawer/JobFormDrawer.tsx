"use client";

import { useState } from "react";

import { JobForm } from "@/components/jobs/JobForm";
import { Drawer } from "@/components/shared/Drawer";
import { useCreateJob, useUpdateJob } from "@/hooks/jobs";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { toDateOnlyKey } from "@/lib/date/date-only";
import { toDateTimeLocalKey } from "@/lib/date/date-time";
import {
  EMPTY_JOB_FORM_VALUES,
  toJobInput,
  toJobUpdateInput,
  type JobFormValues,
} from "@/lib/validations/job.schema";
import type { Job, JobFormMode, JobStatus } from "@/types/jobs.types";

type JobFormDrawerProps = {
  mode: JobFormMode;
  job?: Job;
  /** Pre-selects the status when creating a job (e.g. from a Kanban column). */
  initialStatus?: JobStatus;
  onClose: () => void;
  onSuccess?: (job: Job) => void;
};

function jobToFormValues(job: Job): JobFormValues {
  return {
    title: job.title,
    companyName: job.company?.name ?? "",
    status: job.status,
    priority: job.priority,
    source: job.source ?? "",
    employmentType: job.employmentType ?? "",
    remoteType: job.remoteType ?? "",
    location: job.location ?? "",
    salaryMin: job.salaryMin != null ? String(job.salaryMin) : "",
    salaryMax: job.salaryMax != null ? String(job.salaryMax) : "",
    salaryCurrency: job.salaryCurrency ?? "",
    url: job.url ?? "",
    appliedAt: toDateOnlyKey(job.appliedAt) ?? "",
    nextActionDate: toDateTimeLocalKey(job.nextActionDate) ?? "",
    description: job.description ?? "",
  };
}

export function JobFormDrawer({
  mode,
  job,
  initialStatus,
  onClose,
  onSuccess,
}: JobFormDrawerProps) {
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isEdit = mode === "edit";
  const isSubmitting = createJob.isPending || updateJob.isPending;

  const defaultValues =
    isEdit && job
      ? jobToFormValues(job)
      : initialStatus
        ? { ...EMPTY_JOB_FORM_VALUES, status: initialStatus }
        : undefined;

  const handleSubmit = async (values: JobFormValues) => {
    setErrorMessage(null);

    try {
      const savedJob =
        isEdit && job
          ? await updateJob.mutateAsync({
              id: job.id,
              input: toJobUpdateInput(values),
            })
          : await createJob.mutateAsync(toJobInput(values));

      onSuccess?.(savedJob);
      onClose();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  };

  return (
    <Drawer title={isEdit ? "Edit Job" : "Add New Job"} onClose={onClose}>
      <JobForm
        defaultValues={defaultValues}
        submitLabel={isEdit ? "Save changes" : "Create job"}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Drawer>
  );
}
