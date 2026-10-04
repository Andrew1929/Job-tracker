"use client";

import { InterviewForm } from "@/components/interviews/InterviewForm";
import { Drawer } from "@/components/shared/Drawer";
import { useCreateInterview, useUpdateInterview } from "@/hooks/interviews";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { toDateTimeLocalKey } from "@/lib/date/date-time";
import type { InterviewFormValues } from "@/lib/validations/interview.schema";

import type { CreateInterviewInput, Interview, InterviewFormMode, UpdateInterviewInput } from "@/types/interviews.types";
import type { SelectOption } from "@/types/select-option.types";
import { useState } from "react";

type InterviewFormDrawerProps = {
  mode: InterviewFormMode;
  interview?: Interview;
  jobOptions: readonly SelectOption[];
  onClose: () => void;
};

function interviewToFormValues(interview: Interview): InterviewFormValues {
  return {
    jobId: interview.jobId,
    type: interview.type,
    scheduledAt: toDateTimeLocalKey(interview.scheduledAt) ?? "",
    durationMinutes:
      interview.durationMinutes != null
        ? String(interview.durationMinutes)
        : "",
    remoteType: interview.remoteType ?? "",
    location: interview.location ?? "",
    interviewers: interview.interviewers.join(", "),
    prepNotes: interview.prepNotes ?? "",
    status: interview.status,
    result: interview.result,
    rating: interview.rating != null ? String(interview.rating) : "",
    difficulty: interview.difficulty != null ? String(interview.difficulty) : "",
    feedback: interview.feedback ?? "",
  };
}

function formatJobLabel(interview: Interview): string {
  const company = interview.job.company?.name;
  return company ? `${interview.job.title} · ${company}` : interview.job.title;
}

function formValuesToCreateInput(
  values: InterviewFormValues,
): CreateInterviewInput {
  return {
    jobId: values.jobId,
    type: values.type,
    scheduledAt: values.scheduledAt,

    durationMinutes:
      values.durationMinutes !== ""
        ? Number(values.durationMinutes)
        : undefined,

    remoteType: values.remoteType || undefined,
    location: values.location || undefined,

    interviewers: values.interviewers
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),

    prepNotes: values.prepNotes || undefined,
    status: values.status,
    result: values.result,

    rating:
      values.rating !== ""
        ? Number(values.rating)
        : undefined,

    difficulty:
      values.difficulty !== ""
        ? Number(values.difficulty)
        : undefined,

    feedback: values.feedback || undefined,
  };
}

function formValuesToUpdateInput(
  values: InterviewFormValues,
): UpdateInterviewInput {
  return {
    type: values.type,
    scheduledAt: values.scheduledAt,

    durationMinutes:
      values.durationMinutes !== ""
        ? Number(values.durationMinutes)
        : undefined,

    remoteType: values.remoteType || undefined,
    location: values.location || undefined,

    interviewers: values.interviewers
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),

    prepNotes: values.prepNotes || undefined,
    status: values.status,
    result: values.result,

    rating:
      values.rating !== ""
        ? Number(values.rating)
        : undefined,

    difficulty:
      values.difficulty !== ""
        ? Number(values.difficulty)
        : undefined,

    feedback: values.feedback || undefined,
  };
}

/** Create/edit shell with the same structure as `JobFormDrawer`. */
export function InterviewFormDrawer({
  mode,
  interview,
  jobOptions,
  onClose,
}: InterviewFormDrawerProps) {
  const isEdit = mode === "edit" && interview !== undefined;

  const createInterview = useCreateInterview();
  const updateInterview = useUpdateInterview();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSubmitting = isEdit
    ? updateInterview.isPending
    : createInterview.isPending;

 const handleCreateInterview = async (
    values: InterviewFormValues,
  ) => {
    setErrorMessage(null);

    try {
      const input = formValuesToCreateInput(values);

      await createInterview.mutateAsync(input);

      onClose();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  };

  const handleUpdateInterview = async (
    values: InterviewFormValues,
  ) => {
    if (!interview) {
      return;
    }

    setErrorMessage(null);

    try {
      const input = formValuesToUpdateInput(values);

      await updateInterview.mutateAsync({
        id: interview.id,
        input,
      });

      onClose();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  };

  return (
    <Drawer title={isEdit ? "Edit interview" : "Add interview"} onClose={onClose}>
      <InterviewForm
        mode={isEdit ? "edit" : "create"}
        defaultValues={isEdit ? interviewToFormValues(interview) : undefined}
        jobOptions={jobOptions}
        jobLabel={isEdit ? formatJobLabel(interview) : undefined}
        submitLabel={isEdit ? "Save changes" : "Create interview"}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onSubmit={isEdit ? handleUpdateInterview : handleCreateInterview}
        onCancel={onClose}
      />
    </Drawer>
  );
}
