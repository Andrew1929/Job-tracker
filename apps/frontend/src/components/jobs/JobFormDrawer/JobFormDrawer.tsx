"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Drawer } from "@/components/shared/Drawer";
import { SelectField } from "@/components/shared/SelectField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JOB_STATUS_OPTIONS } from "@/constants/jobs.constants";
import { parseJobStatus } from "@/lib/jobs/job-status";
import {
  jobFormSchema,
  type JobFormValues,
} from "@/lib/validations/job.schema";

import type { JobFormMode } from "@/types/jobs.types";

type JobFormDrawerProps = {
  mode: JobFormMode;
  initialValues?: JobFormValues;
  onClose: () => void;
  onSubmit: (values: JobFormValues) => void;
};

const EMPTY_FORM_VALUES: JobFormValues = {
  company: "",
  position: "",
  status: "Applied",
  salary: "",
  jobPostingUrl: "",
  location: "",
  notes: "",
};

type FieldErrorProps = {
  id: string;
  message?: string;
};

function FieldError({ id, message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}

export function JobFormDrawer({
  mode,
  initialValues,
  onClose,
  onSubmit,
}: JobFormDrawerProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: initialValues ?? EMPTY_FORM_VALUES,
  });

  return (
    <Drawer
      title={mode === "create" ? "Add New Job" : "Edit Job"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="job-company">Company</Label>
            <Input
              id="job-company"
              type="text"
              placeholder="Company name"
              aria-invalid={Boolean(errors.company)}
              aria-describedby={
                errors.company ? "job-company-error" : undefined
              }
              {...register("company")}
            />
            <FieldError id="job-company-error" message={errors.company?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-position">Position</Label>
            <Input
              id="job-position"
              type="text"
              placeholder="Job position"
              aria-invalid={Boolean(errors.position)}
              aria-describedby={
                errors.position ? "job-position-error" : undefined
              }
              {...register("position")}
            />
            <FieldError
              id="job-position-error"
              message={errors.position?.message}
            />
          </div>

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <SelectField
                id="job-status"
                label="Status"
                value={field.value}
                options={JOB_STATUS_OPTIONS}
                onChange={(value) => field.onChange(parseJobStatus(value))}
              />
            )}
          />

          <div className="space-y-2">
            <Label htmlFor="job-salary">Salary (USD)</Label>
            <Input
              id="job-salary"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 130000"
              aria-invalid={Boolean(errors.salary)}
              aria-describedby={errors.salary ? "job-salary-error" : undefined}
              {...register("salary")}
            />
            <FieldError id="job-salary-error" message={errors.salary?.message} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="job-posting-url">Job Posting URL</Label>
          <Input
            id="job-posting-url"
            type="url"
            placeholder="https://..."
            aria-invalid={Boolean(errors.jobPostingUrl)}
            aria-describedby={
              errors.jobPostingUrl ? "job-posting-url-error" : undefined
            }
            {...register("jobPostingUrl")}
          />
          <FieldError
            id="job-posting-url-error"
            message={errors.jobPostingUrl?.message}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="job-location">Location</Label>
          <Input
            id="job-location"
            type="text"
            placeholder="e.g. Remote, New York"
            {...register("location")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="job-notes">Notes</Label>
          <Textarea
            id="job-notes"
            placeholder="Add any notes about this job..."
            {...register("notes")}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Job</Button>
        </div>
      </form>
    </Drawer>
  );
}
