"use client";

import { useState } from "react";

import { JobForm } from "@/components/jobs/JobForm";
import { Drawer } from "@/components/shared/Drawer";
import { useCreateJob, useUpdateJob } from "@/hooks/jobs";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { toJobInput, type JobFormValues } from "@/lib/validations/job.schema";
import type { Job, JobFormMode } from "@/types/jobs.types";

type JobFormDrawerProps = {
  mode: JobFormMode;
  job?: Job;
  onClose: () => void;
  onSuccess?: (job: Job) => void;
};

function jobToFormValues(job: Job): JobFormValues {
  return {
    title: job.title,
    companyName: job.company?.name ?? "",
    status: job.status,
    url: job.url ?? "",
    appliedAt: job.appliedAt ? job.appliedAt.slice(0, 10) : "",
    description: job.description ?? "",
  };
}

export function JobFormDrawer({
  mode,
  job,
  onClose,
  onSuccess,
}: JobFormDrawerProps) {
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isEdit = mode === "edit";
  const isSubmitting = createJob.isPending || updateJob.isPending;

  const handleSubmit = async (values: JobFormValues) => {
    setErrorMessage(null);
    const input = toJobInput(values);

    try {
      const savedJob =
        isEdit && job
          ? await updateJob.mutateAsync({ id: job.id, input })
          : await createJob.mutateAsync(input);

      onSuccess?.(savedJob);
      onClose();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  };

  return (
    <Drawer title={isEdit ? "Edit Job" : "Add New Job"} onClose={onClose}>
      <JobForm
        defaultValues={isEdit && job ? jobToFormValues(job) : undefined}
        submitLabel={isEdit ? "Save changes" : "Create job"}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Drawer>
  );
}
