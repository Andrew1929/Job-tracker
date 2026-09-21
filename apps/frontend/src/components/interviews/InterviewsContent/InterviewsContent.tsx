"use client";

import { useState } from "react";

import { InterviewDetailsDrawer } from "@/components/interviews/InterviewDetailsDrawer";
import { InterviewFormDrawer } from "@/components/interviews/InterviewFormDrawer";
import { InterviewRescheduleDialog } from "@/components/interviews/InterviewRescheduleDialog";
import { InterviewsFilter } from "@/components/interviews/InterviewsFilter";
import { InterviewsHeader } from "@/components/interviews/InterviewsHeader";
import { InterviewsList } from "@/components/interviews/InterviewsList";
import { InterviewsSummary } from "@/components/interviews/InterviewsSummary";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  ALL_JOBS_FILTER_OPTION,
  DEFAULT_INTERVIEW_SORT_VALUE,
  INTERVIEW_TYPE_LABELS,
  INTERVIEWS_PAGE_SIZE,
} from "@/constants/interviews.constants";
import { ALL_FILTER_VALUE } from "@/constants/jobs.constants";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import {
  PLACEHOLDER_INTERVIEW_SUMMARY,
  PLACEHOLDER_INTERVIEWS,
  PLACEHOLDER_JOB_OPTIONS,
} from "./interviews.placeholder";

import type { InterviewsSummaryCounts } from "@/components/interviews/InterviewsSummary";
import type { Interview } from "@/types/interviews.types";
import type { SelectOption } from "@/types/select-option.types";

type InterviewFormState =
  | { mode: "create" }
  | { mode: "edit"; interview: Interview }
  | null;

export function InterviewsContent() {
  // ---------------------------------------------------------------------------
  // Filter UI state. Kept local for now; it can move into
  // `useInterviewFilters` once that hook derives the query params.
  // ---------------------------------------------------------------------------
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE);
  const [typeFilter, setTypeFilter] = useState(ALL_FILTER_VALUE);
  const [jobFilter, setJobFilter] = useState(ALL_FILTER_VALUE);
  const [sortValue, setSortValue] = useState(DEFAULT_INTERVIEW_SORT_VALUE);

  const debouncedSearch = useDebouncedValue(searchInput);

  const hasActiveFilters =
    debouncedSearch.trim().length > 0 ||
    statusFilter !== ALL_FILTER_VALUE ||
    typeFilter !== ALL_FILTER_VALUE ||
    jobFilter !== ALL_FILTER_VALUE;

  // Any filter change returns to the first page, as on the Jobs page.
  const withPageReset =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      setPage(1);
    };

  // ---------------------------------------------------------------------------
  // Overlay UI state. The drawer tracks an id, not a copy, so it re-reads the
  // interview from the list and reflects fresh data once queries refetch.
  // ---------------------------------------------------------------------------
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(
    null,
  );
  const [formState, setFormState] = useState<InterviewFormState>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Interview | null>(
    null,
  );
  const [completeTarget, setCompleteTarget] = useState<Interview | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Interview | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Interview | null>(null);

  // ---------------------------------------------------------------------------
  // Data — intentionally NOT implemented. Everything below is placeholder.
  // ---------------------------------------------------------------------------

  // TODO(data): replace with your interviews list query. The endpoint accepts
  // status, jobId, sortOrder, page and limit (max 100) — build those from the
  // filter state above.
  const interviews: Interview[] = PLACEHOLDER_INTERVIEWS;
  const isLoading = false;
  const isError = false;
  const errorMessage = "";
  const isFetching = false;
  const handleRetry = () => {
    // TODO: refetch the interviews query.
  };

  // TODO(data): the API has no search or type filter. Apply
  // `debouncedSearch` and `typeFilter` to the loaded interviews here before
  // they reach the table. Until then the list is shown unfiltered.
  const visibleInterviews = interviews;

  // TODO(data): derive these four counts from the interviews API
  // (see the field notes on `InterviewsSummaryCounts`).
  const summaryCounts: InterviewsSummaryCounts = PLACEHOLDER_INTERVIEW_SUMMARY;

  // TODO(data): load the user's jobs and map them to `{ value: id, label }`.
  // The same list feeds the job filter and the form's job picker.
  const jobOptions: readonly SelectOption[] = PLACEHOLDER_JOB_OPTIONS;
  const jobFilterOptions: readonly SelectOption[] = [
    ALL_JOBS_FILTER_OPTION,
    ...jobOptions,
  ];

  // Client-side paging over whatever list the table receives.
  const totalPages = Math.max(
    1,
    Math.ceil(visibleInterviews.length / INTERVIEWS_PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);
  const pageInterviews = visibleInterviews.slice(
    (currentPage - 1) * INTERVIEWS_PAGE_SIZE,
    currentPage * INTERVIEWS_PAGE_SIZE,
  );

  const selectedInterview =
    interviews.find((interview) => interview.id === selectedInterviewId) ??
    null;

  // ---------------------------------------------------------------------------
  // Lifecycle actions — placeholders. Each dialog closes so the flow can be
  // clicked through, but nothing is sent to the API yet.
  // ---------------------------------------------------------------------------

  // TODO(data): pending flags and error messages for the dialogs below.
  const isActionPending = false;
  const actionErrorMessage: string | null = null;

  const handleCompleteInterview = () => {
    // TODO: connect the update mutation to set status COMPLETED for
    // `completeTarget`. The API stamps `completedAt` itself.
    console.info("[interviews] complete not connected yet", completeTarget?.id);
    setCompleteTarget(null);
  };

  const handleCancelInterview = () => {
    // TODO: connect the update mutation to set status CANCELLED for
    // `cancelTarget`.
    console.info("[interviews] cancel not connected yet", cancelTarget?.id);
    setCancelTarget(null);
  };

  const handleRescheduleInterview = (scheduledAtLocalKey: string) => {
    // TODO: connect the update mutation with the new `scheduledAt`.
    // The value is a local `YYYY-MM-DDTHH:mm` key and needs converting to an
    // ISO instant. Decide whether rescheduling a CANCELLED or NO_SHOW
    // interview should also move it back to SCHEDULED.
    console.info(
      "[interviews] reschedule not connected yet",
      rescheduleTarget?.id,
      scheduledAtLocalKey,
    );
    setRescheduleTarget(null);
  };

  const handleDeleteInterview = () => {
    // TODO: connect the delete mutation for `deleteTarget`. On success, step
    // back a page if the last row of a later page was removed.
    console.info("[interviews] delete not connected yet", deleteTarget?.id);
    setDeleteTarget(null);
  };

  const openEdit = (interview: Interview) => {
    // Swap the details drawer for the form rather than stacking two drawers.
    setSelectedInterviewId(null);
    setFormState({ mode: "edit", interview });
  };

  // e.g. "Frontend Developer at Spotify (Technical)" — a job can have several
  // interviews, so the type is what tells them apart in a confirmation.
  const describeInterview = (interview: Interview) => {
    const role = interview.job.company
      ? `${interview.job.title} at ${interview.job.company.name}`
      : interview.job.title;
    return `${role} (${INTERVIEW_TYPE_LABELS[interview.type]})`;
  };

  return (
    <div className="flex min-h-full flex-col gap-6">
      <InterviewsHeader onAddInterview={() => setFormState({ mode: "create" })} />

      <InterviewsSummary counts={summaryCounts} />

      <Card className="flex flex-1 flex-col">
        <CardContent className="flex flex-1 flex-col gap-6">
          <InterviewsFilter
            searchQuery={searchInput}
            onSearchChange={withPageReset(setSearchInput)}
            statusFilter={statusFilter}
            onStatusFilterChange={withPageReset(setStatusFilter)}
            typeFilter={typeFilter}
            onTypeFilterChange={withPageReset(setTypeFilter)}
            jobFilter={jobFilter}
            onJobFilterChange={withPageReset(setJobFilter)}
            jobOptions={jobFilterOptions}
            sortValue={sortValue}
            onSortChange={withPageReset(setSortValue)}
          />

          <InterviewsList
            interviews={pageInterviews}
            isLoading={isLoading}
            isError={isError}
            errorMessage={errorMessage}
            isFetching={isFetching}
            hasActiveFilters={hasActiveFilters}
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            onRetry={handleRetry}
            onOpenDetails={(interview) => setSelectedInterviewId(interview.id)}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        </CardContent>
      </Card>

      {selectedInterview ? (
        <InterviewDetailsDrawer
          interview={selectedInterview}
          onClose={() => setSelectedInterviewId(null)}
          onEdit={openEdit}
          onReschedule={setRescheduleTarget}
          onComplete={setCompleteTarget}
          onCancel={setCancelTarget}
          onDelete={setDeleteTarget}
        />
      ) : null}

      {formState ? (
        <InterviewFormDrawer
          mode={formState.mode}
          interview={formState.mode === "edit" ? formState.interview : undefined}
          jobOptions={jobOptions}
          onClose={() => setFormState(null)}
        />
      ) : null}

      {rescheduleTarget ? (
        <InterviewRescheduleDialog
          interview={rescheduleTarget}
          isLoading={isActionPending}
          errorMessage={actionErrorMessage}
          onClose={() => setRescheduleTarget(null)}
          onConfirm={handleRescheduleInterview}
        />
      ) : null}

      <ConfirmDialog
        open={completeTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCompleteTarget(null);
          }
        }}
        title="Mark interview as completed"
        description={
          completeTarget
            ? `Mark the interview for ${describeInterview(completeTarget)} as completed? You can add the result, rating and feedback afterwards.`
            : ""
        }
        confirmLabel="Mark as completed"
        isLoading={isActionPending}
        errorMessage={actionErrorMessage}
        onConfirm={handleCompleteInterview}
      />

      <ConfirmDialog
        open={cancelTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCancelTarget(null);
          }
        }}
        title="Cancel interview"
        description={
          cancelTarget
            ? `Cancel the interview for ${describeInterview(cancelTarget)}? It stays in your list as Cancelled.`
            : ""
        }
        confirmLabel="Cancel interview"
        cancelLabel="Keep interview"
        destructive
        isLoading={isActionPending}
        errorMessage={actionErrorMessage}
        onConfirm={handleCancelInterview}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        title="Delete interview"
        description={
          deleteTarget
            ? `Delete the interview for ${describeInterview(deleteTarget)}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        destructive
        isLoading={isActionPending}
        errorMessage={actionErrorMessage}
        onConfirm={handleDeleteInterview}
      />
    </div>
  );
}
