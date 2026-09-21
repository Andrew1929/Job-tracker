"use client";

import { InterviewForm } from "@/components/interviews/InterviewForm";
import { Drawer } from "@/components/shared/Drawer";
import { toDateTimeLocalKey } from "@/lib/date/date-time";
import type { InterviewFormValues } from "@/lib/validations/interview.schema";

import type { Interview, InterviewFormMode } from "@/types/interviews.types";
import type { SelectOption } from "@/types/select-option.types";

type InterviewFormDrawerProps = {
  mode: InterviewFormMode;
  interview?: Interview;
  jobOptions: readonly SelectOption[];
  onClose: () => void;
};

/**
 * Prefills the edit form from an interview already on screen. This only turns
 * loaded values into form strings; it never builds a request.
 */
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

/** Create/edit shell with the same structure as `JobFormDrawer`. */
export function InterviewFormDrawer({
  mode,
  interview,
  jobOptions,
  onClose,
}: InterviewFormDrawerProps) {
  const isEdit = mode === "edit" && interview !== undefined;

  // TODO(data): replace with the pending state of your create/update mutations.
  const isSubmitting = false;

  // TODO(data): hold the API error message here (see `getApiErrorMessage`)
  // and set it when a create/update call fails.
  const errorMessage: string | null = null;

  const handleCreateInterview = (values: InterviewFormValues) => {
    // TODO: connect the create mutation.
    // Map `values` to a CreateInterviewInput, submit it, then close on success.
    console.info("[interviews] create not connected yet", values);
  };

  const handleUpdateInterview = (values: InterviewFormValues) => {
    // TODO: connect the update mutation.
    // Map `values` to an UpdateInterviewInput (no jobId) for `interview.id`,
    // submit it, then close on success.
    console.info("[interviews] update not connected yet", values);
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
