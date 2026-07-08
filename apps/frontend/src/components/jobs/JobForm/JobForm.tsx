"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SelectField } from "@/components/shared/SelectField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JOB_STATUS_OPTIONS } from "@/constants/jobs.constants";
import {
  EMPTY_JOB_FORM_VALUES,
  jobFormSchema,
  type JobFormValues,
} from "@/lib/validations/job.schema";
import type { JobStatus } from "@/types/jobs.types";

type JobFormProps = {
  defaultValues?: JobFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onSubmit: (values: JobFormValues) => void;
  onCancel: () => void;
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

export function JobForm({
  defaultValues,
  submitLabel,
  isSubmitting,
  errorMessage,
  onSubmit,
  onCancel,
}: JobFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: defaultValues ?? EMPTY_JOB_FORM_VALUES,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {errorMessage ? (
        <p
          className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="job-title">Title</Label>
        <Input
          id="job-title"
          type="text"
          placeholder="e.g. Senior Frontend Engineer"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "job-title-error" : undefined}
          {...register("title")}
        />
        <FieldError id="job-title-error" message={errors.title?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="job-company">Company</Label>
          <Input
            id="job-company"
            type="text"
            placeholder="Company name"
            aria-invalid={Boolean(errors.companyName)}
            aria-describedby={
              errors.companyName ? "job-company-error" : undefined
            }
            {...register("companyName")}
          />
          <FieldError
            id="job-company-error"
            message={errors.companyName?.message}
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
              onChange={(value) => field.onChange(value as JobStatus)}
            />
          )}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="job-applied-at">Applied date</Label>
          <Input
            id="job-applied-at"
            type="date"
            aria-invalid={Boolean(errors.appliedAt)}
            aria-describedby={
              errors.appliedAt ? "job-applied-at-error" : undefined
            }
            {...register("appliedAt")}
          />
          <FieldError
            id="job-applied-at-error"
            message={errors.appliedAt?.message}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="job-url">Job posting URL</Label>
          <Input
            id="job-url"
            type="url"
            placeholder="https://..."
            aria-invalid={Boolean(errors.url)}
            aria-describedby={errors.url ? "job-url-error" : undefined}
            {...register("url")}
          />
          <FieldError id="job-url-error" message={errors.url?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-description">Description</Label>
        <Textarea
          id="job-description"
          placeholder="Role summary, responsibilities, notes…"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "job-description-error" : undefined
          }
          {...register("description")}
        />
        <FieldError
          id="job-description-error"
          message={errors.description?.message}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
