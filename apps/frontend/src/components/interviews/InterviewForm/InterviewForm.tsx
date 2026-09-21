"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SelectField } from "@/components/shared/SelectField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  INTERVIEW_MAX_DURATION_MINUTES,
  INTERVIEW_MAX_INTERVIEWERS,
  INTERVIEW_RATING_OPTIONS,
  INTERVIEW_RESULT_OPTIONS,
  INTERVIEW_STATUS_OPTIONS,
  INTERVIEW_TYPE_OPTIONS,
} from "@/constants/interviews.constants";
import { REMOTE_TYPE_OPTIONS } from "@/constants/jobs.constants";
import {
  EMPTY_INTERVIEW_FORM_VALUES,
  interviewFormSchema,
  type InterviewFormValues,
} from "@/lib/validations/interview.schema";

import type { InterviewFormMode } from "@/types/interviews.types";
import type { SelectOption } from "@/types/select-option.types";

type InterviewFormProps = {
  mode: InterviewFormMode;
  defaultValues?: InterviewFormValues;
  /** Jobs the interview can belong to. Only used when creating. */
  jobOptions: readonly SelectOption[];
  /** Read-only job label shown in edit mode, where the job cannot change. */
  jobLabel?: string;
  submitLabel: string;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onSubmit: (values: InterviewFormValues) => void;
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

const JOB_PLACEHOLDER_OPTION: SelectOption = {
  value: "",
  label: "Select a job",
};

/**
 * One form for both create and edit, laid out like `JobForm`. Create collects
 * the scheduling fields; edit adds the outcome block (status, result, scores
 * and feedback) because that is where a completed interview gets recorded.
 */
export function InterviewForm({
  mode,
  defaultValues,
  jobOptions,
  jobLabel,
  submitLabel,
  isSubmitting,
  errorMessage,
  onSubmit,
  onCancel,
}: InterviewFormProps) {
  const isEdit = mode === "edit";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: defaultValues ?? EMPTY_INTERVIEW_FORM_VALUES,
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

      {isEdit ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Job</p>
          <p className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5 text-sm text-foreground">
            {jobLabel ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            An interview stays attached to the job it was created for.
          </p>
        </div>
      ) : (
        <Controller
          control={control}
          name="jobId"
          render={({ field }) => (
            <div className="space-y-2">
              <SelectField
                id="interview-job"
                label="Job"
                value={field.value}
                options={[JOB_PLACEHOLDER_OPTION, ...jobOptions]}
                onChange={field.onChange}
              />
              <FieldError
                id="interview-job-error"
                message={errors.jobId?.message}
              />
            </div>
          )}
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <SelectField
              id="interview-type"
              label="Interview type"
              value={field.value}
              options={INTERVIEW_TYPE_OPTIONS}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="remoteType"
          render={({ field }) => (
            <SelectField
              id="interview-remote-type"
              label="Mode"
              value={field.value}
              options={REMOTE_TYPE_OPTIONS}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="interview-scheduled-at">Date and time</Label>
          <Input
            id="interview-scheduled-at"
            type="datetime-local"
            aria-invalid={Boolean(errors.scheduledAt)}
            aria-describedby={
              errors.scheduledAt ? "interview-scheduled-at-error" : undefined
            }
            {...register("scheduledAt")}
          />
          <FieldError
            id="interview-scheduled-at-error"
            message={errors.scheduledAt?.message}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interview-duration">Duration (minutes)</Label>
          <Input
            id="interview-duration"
            type="number"
            inputMode="numeric"
            min={0}
            max={INTERVIEW_MAX_DURATION_MINUTES}
            step={5}
            placeholder="e.g. 45"
            aria-invalid={Boolean(errors.durationMinutes)}
            aria-describedby={
              errors.durationMinutes ? "interview-duration-error" : undefined
            }
            {...register("durationMinutes")}
          />
          <FieldError
            id="interview-duration-error"
            message={errors.durationMinutes?.message}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interview-location">Location</Label>
        <Input
          id="interview-location"
          type="text"
          placeholder="Office address or meeting link"
          aria-invalid={Boolean(errors.location)}
          aria-describedby={
            errors.location ? "interview-location-error" : undefined
          }
          {...register("location")}
        />
        <FieldError
          id="interview-location-error"
          message={errors.location?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interview-interviewers">Interviewers</Label>
        <Input
          id="interview-interviewers"
          type="text"
          placeholder="e.g. Anna Smith, John Lee"
          aria-invalid={Boolean(errors.interviewers)}
          aria-describedby={
            errors.interviewers
              ? "interview-interviewers-error"
              : "interview-interviewers-hint"
          }
          {...register("interviewers")}
        />
        {errors.interviewers ? (
          <FieldError
            id="interview-interviewers-error"
            message={errors.interviewers.message}
          />
        ) : (
          <p
            id="interview-interviewers-hint"
            className="text-xs text-muted-foreground"
          >
            Separate names with commas, up to {INTERVIEW_MAX_INTERVIEWERS}.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="interview-prep-notes">Preparation notes</Label>
        <Textarea
          id="interview-prep-notes"
          placeholder="Topics to review, questions to ask, things to bring…"
          aria-invalid={Boolean(errors.prepNotes)}
          aria-describedby={
            errors.prepNotes ? "interview-prep-notes-error" : undefined
          }
          {...register("prepNotes")}
        />
        <FieldError
          id="interview-prep-notes-error"
          message={errors.prepNotes?.message}
        />
      </div>

      {isEdit ? (
        <section
          className="space-y-5 border-t border-border/60 pt-5"
          aria-labelledby="interview-outcome-heading"
        >
          <h3
            id="interview-outcome-heading"
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            Outcome
          </h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <SelectField
                  id="interview-status"
                  label="Status"
                  value={field.value}
                  options={INTERVIEW_STATUS_OPTIONS}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="result"
              render={({ field }) => (
                <SelectField
                  id="interview-result"
                  label="Result"
                  value={field.value}
                  options={INTERVIEW_RESULT_OPTIONS}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              control={control}
              name="rating"
              render={({ field }) => (
                <SelectField
                  id="interview-rating"
                  label="Rating"
                  value={field.value}
                  options={INTERVIEW_RATING_OPTIONS}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="difficulty"
              render={({ field }) => (
                <SelectField
                  id="interview-difficulty"
                  label="Difficulty"
                  value={field.value}
                  options={INTERVIEW_RATING_OPTIONS}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interview-feedback">Feedback</Label>
            <Textarea
              id="interview-feedback"
              placeholder="How it went, what was asked, what to improve…"
              aria-invalid={Boolean(errors.feedback)}
              aria-describedby={
                errors.feedback ? "interview-feedback-error" : undefined
              }
              {...register("feedback")}
            />
            <FieldError
              id="interview-feedback-error"
              message={errors.feedback?.message}
            />
          </div>
        </section>
      ) : null}

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
