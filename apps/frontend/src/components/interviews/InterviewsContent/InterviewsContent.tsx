"use client";

import { useMemo, useState } from "react";

import { InterviewDetailsDrawer } from "@/components/interviews/InterviewDetailsDrawer";
import { InterviewFormDrawer } from "@/components/interviews/InterviewFormDrawer";
import { InterviewRescheduleDialog } from "@/components/interviews/InterviewRescheduleDialog";
import { InterviewsFilter } from "@/components/interviews/InterviewsFilter";
import { InterviewsHeader } from "@/components/interviews/InterviewsHeader";
import { InterviewsList } from "@/components/interviews/InterviewsList";
import { InterviewsSummary } from "@/components/interviews/InterviewsSummary";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_JOBS_PAGE_SIZE } from "@/constants/jobs.constants";
import type { Interview, InterviewsQueryParams } from "@/types/interviews.types";
import { buildInterviewOptions, useDeleteInterview, useInterviewFilters, useInterviewsQuery } from "@/hooks/interviews";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { calculateInterviewSummary } from "@/lib/interviews/summary-interview";

type InterviewFormState =
  | { mode: "create" }
  | { mode: "edit"; interview: Interview }
  | null;

export function InterviewsContent() {
  const [page, setPage] = useState(1);
  const [formState, setFormState] = useState<InterviewFormState>(null)
  const [deleteTarget, setDeleteTarget] = useState<Interview | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [rescheduleTarget, setRescheduleTarget] = useState<Interview | null>(null)
  const [completeTarget, setCompleteTarget] = useState<Interview | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Interview | null>(null)

  const filters = useInterviewFilters({onChange: () => setPage(1)});

  const queryParams = useMemo<InterviewsQueryParams>(
    () => ({ page, limit: DEFAULT_JOBS_PAGE_SIZE, ...filters.params }),
    [page, filters.params],
  );
 
  const interviewsQuery = useInterviewsQuery(queryParams);
  const deleteInterview = useDeleteInterview();

  const interviews = useMemo (
    () => interviewsQuery.data?.items ?? [],
    [interviewsQuery.data]
  );

  const summaryCounts = useMemo (
    () => calculateInterviewSummary(interviews),
    [interviews]
  );

  const meta = interviewsQuery.data?.meta;

  const interviewsOption = useMemo (
    () => buildInterviewOptions(interviews),
    [interviews]
  );

  const handleConfirmDelete = async () => {
    if(!deleteTarget) {
      return
    }

    setDeleteError(null)

    try {
      await deleteInterview.mutateAsync(deleteTarget.id); 

      if(interviews.length === 1 && page > 1) {
        setPage((current) => current - 1);
      }
    } catch (error) {
      setDeleteError(getApiErrorMessage(error))
    }
  };

  const handleCompleteInterview = () => {};
  const handleRescheduleInterview = () => {};
  const describeInterview = () => {};
  const handleCancelInterview = () => {};

  return (
    <div className="flex min-h-full flex-col gap-6">
      <InterviewsHeader onAddInterview={() => setFormState({ mode: "create" })} />

      <InterviewsSummary counts={summaryCounts} />

      <Card className="flex flex-1 flex-col">
        <CardContent className="flex flex-1 flex-col gap-6">
          <InterviewsFilter
            searchQuery={filters.searchInput}
            onSearchChange={filters.handleSearchChange}
            statusFilter={filters.statusFilter}
            onStatusFilterChange={filters.handleStatusFilterChange}
            typeFilter={filters.typeFilter}
            onTypeFilterChange={filters.handleTypeFilterChange}
            jobFilter={filters.jobFilter}
            onJobFilterChange={filters.handleJobFilterChange}
            jobOptions={interviewsOption}
            sortValue={filters.sortOrder}
            onSortChange={filters.handleSortChange}
          />

          <InterviewsList
            interviews={interviews}
            isLoading={interviewsQuery.isLoading}
            isError={interviewsQuery.isError}
            errorMessage={getApiErrorMessage(interviewsQuery.error)}
            isFetching={interviewsQuery.isFetching}
            hasActiveFilters={filters.hasActiveFilters}
            page={page}
            totalPages={meta?.totalPages ?? 0}
            onPageChange={setPage}
            onRetry={() => void interviewsQuery.refetch()}
            onOpenDetails={(interview) => setSelectedInterview(interview)}
            onEdit={(interview) => setFormState({mode: "edit", interview})}
            onDelete={(interview) => {
              setDeleteError(null);
              setDeleteTarget(interview);
            }}
          />
        </CardContent>
      </Card>

      {selectedInterview ? (
        <InterviewDetailsDrawer
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
          onEdit={(interview) => {
            setSelectedInterview(null);
            setFormState({ mode: "edit", interview});
          }}
          onReschedule={(interview) => setRescheduleTarget(interview)}
          onComplete={(interview) => setCompleteTarget(interview)}
          onCancel={(interview) => setCancelTarget(interview)}
          onDelete={(interview) => setDeleteTarget(interview)}
        />
      ) : null}

      {formState ? (
        <InterviewFormDrawer
          mode={formState.mode}
          interview={formState.mode === "edit" ? formState.interview : undefined}
          jobOptions={interviewsOption}
          onClose={() => setFormState(null)}
        />
      ) : null}

      {rescheduleTarget ? (
        <InterviewRescheduleDialog
          interview={rescheduleTarget}
          isLoading={interviewsQuery.isLoading}
          errorMessage={getApiErrorMessage(interviewsQuery.error)}
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
        isLoading={interviewsQuery.isLoading}
        errorMessage={getApiErrorMessage(interviewsQuery.error)}
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
        isLoading={interviewsQuery.isLoading}
        errorMessage={getApiErrorMessage(interviewsQuery.error)}
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
        isLoading={deleteInterview.isPending}
        errorMessage={deleteError}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
