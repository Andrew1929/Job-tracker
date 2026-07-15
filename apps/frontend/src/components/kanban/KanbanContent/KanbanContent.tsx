"use client";

import { useMemo, useState } from "react";

import { JobFormDrawer } from "@/components/jobs/JobFormDrawer";
import { JobsFilters } from "@/components/jobs/JobsFilters";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { KanbanHeader } from "@/components/kanban/KanbanHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { KANBAN_BOARD_JOBS_LIMIT } from "@/constants/kanban.constants";
import {
  buildCompanyOptions,
  useJobFilters,
  useJobsQuery,
  useUpdateJobStatus,
} from "@/hooks/jobs";
import { getApiErrorMessage } from "@/lib/api/error-message";

import type { Job, JobsQueryParams, JobStatus } from "@/types/jobs.types";

type CreateFormState = { initialStatus?: JobStatus } | null;

export function KanbanContent() {
  const filters = useJobFilters();

  const queryParams = useMemo<JobsQueryParams>(
    () => ({ page: 1, limit: KANBAN_BOARD_JOBS_LIMIT, ...filters.params }),
    [filters.params],
  );

  const jobsQuery = useJobsQuery(queryParams);
  const updateJobStatus = useUpdateJobStatus();

  const jobs = useMemo(() => jobsQuery.data?.items ?? [], [jobsQuery.data]);
  const companyOptions = useMemo(() => buildCompanyOptions(jobs), [jobs]);

  const [createForm, setCreateForm] = useState<CreateFormState>(null);
  const [moveError, setMoveError] = useState<string | null>(null);

  const handleCardMove = (jobId: string, status: JobStatus) => {
    const job = jobs.find((item: Job) => item.id === jobId);
    if (!job || job.status === status) {
      return;
    }

    setMoveError(null);
    updateJobStatus.mutate(
      { id: jobId, status },
      { onError: (error) => setMoveError(getApiErrorMessage(error)) },
    );
  };

  return (
    <div className="space-y-6">
      <KanbanHeader onAddJob={() => setCreateForm({})} />

      <JobsFilters
        searchQuery={filters.searchInput}
        onSearchChange={filters.handleSearchChange}
        statusFilter={filters.statusFilter}
        onStatusFilterChange={filters.handleStatusFilterChange}
        companyFilter={filters.companyFilter}
        onCompanyFilterChange={filters.handleCompanyFilterChange}
        companyOptions={companyOptions}
        sortValue={filters.sortValue}
        onSortChange={filters.handleSortChange}
      />

      {moveError ? (
        <ErrorState
          title="Could not move job"
          message={moveError}
          onRetry={() => void jobsQuery.refetch()}
        />
      ) : null}

      <KanbanBoard
        jobs={jobs}
        isLoading={jobsQuery.isLoading}
        isError={jobsQuery.isError}
        errorMessage={getApiErrorMessage(jobsQuery.error)}
        isFetching={jobsQuery.isFetching}
        onRetry={() => void jobsQuery.refetch()}
        onCardMove={handleCardMove}
        onAddJob={(status) => setCreateForm({ initialStatus: status })}
      />

      {createForm ? (
        <JobFormDrawer
          mode="create"
          initialStatus={createForm.initialStatus}
          onClose={() => setCreateForm(null)}
        />
      ) : null}
    </div>
  );
}
