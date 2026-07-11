"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SelectField } from "@/components/shared/SelectField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  EMPLOYMENT_TYPE_OPTIONS,
  JOB_PRIORITY_OPTIONS,
  JOB_SOURCE_OPTIONS,
  JOB_STATUS_OPTIONS,
  REMOTE_TYPE_OPTIONS,
} from "@/constants/jobs.constants";
import {
  EMPTY_JOB_FORM_VALUES,
  jobFormSchema,
  type JobFormValues,
} from "@/lib/validations/job.schema";

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
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          control={control}
          name="priority"
          render={({ field }) => (
            <SelectField
              id="job-priority"
              label="Priority"
              value={field.value}
              options={JOB_PRIORITY_OPTIONS}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="source"
          render={({ field }) => (
            <SelectField
              id="job-source"
              label="Source"
              value={field.value}
              options={JOB_SOURCE_OPTIONS}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          control={control}
          name="employmentType"
          render={({ field }) => (
            <SelectField
              id="job-employment-type"
              label="Employment type"
              value={field.value}
              options={EMPLOYMENT_TYPE_OPTIONS}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="remoteType"
          render={({ field }) => (
            <SelectField
              id="job-remote-type"
              label="Work mode"
              value={field.value}
              options={REMOTE_TYPE_OPTIONS}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-location">Location</Label>
        <Input
          id="job-location"
          type="text"
          placeholder="e.g. Berlin, Germany"
          aria-invalid={Boolean(errors.location)}
          aria-describedby={errors.location ? "job-location-error" : undefined}
          {...register("location")}
        />
        <FieldError id="job-location-error" message={errors.location?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="job-salary-min">Salary min</Label>
          <Input
            id="job-salary-min"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="e.g. 60000"
            aria-invalid={Boolean(errors.salaryMin)}
            aria-describedby={
              errors.salaryMin ? "job-salary-min-error" : undefined
            }
            {...register("salaryMin")}
          />
          <FieldError
            id="job-salary-min-error"
            message={errors.salaryMin?.message}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="job-salary-max">Salary max</Label>
          <Input
            id="job-salary-max"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="e.g. 90000"
            aria-invalid={Boolean(errors.salaryMax)}
            aria-describedby={
              errors.salaryMax ? "job-salary-max-error" : undefined
            }
            {...register("salaryMax")}
          />
          <FieldError
            id="job-salary-max-error"
            message={errors.salaryMax?.message}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="job-salary-currency">Currency</Label>
          <Input
            id="job-salary-currency"
            type="text"
            placeholder="USD"
            maxLength={3}
            aria-invalid={Boolean(errors.salaryCurrency)}
            aria-describedby={
              errors.salaryCurrency ? "job-salary-currency-error" : undefined
            }
            {...register("salaryCurrency")}
          />
          <FieldError
            id="job-salary-currency-error"
            message={errors.salaryCurrency?.message}
          />
        </div>
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
          <Label htmlFor="job-next-action-at">Next action date</Label>
          <Input
            id="job-next-action-at"
            type="date"
            aria-invalid={Boolean(errors.nextActionDate)}
            aria-describedby={
              errors.nextActionDate ? "job-next-action-at-error" : undefined
            }
            {...register("nextActionDate")}
          />
          <FieldError
            id="job-next-action-at-error"
            message={errors.nextActionDate?.message}
          />
        </div>
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
