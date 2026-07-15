"use client";

import { useMemo, useState } from "react";

import { JobFormDrawer } from "@/components/jobs/JobFormDrawer";
import { JobsFilters } from "@/components/jobs/JobsFilters";
import { JobsHeader } from "@/components/jobs/JobsHeader";
import { JobsList } from "@/components/jobs/JobsList";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_JOBS_PAGE_SIZE } from "@/constants/jobs.constants";
import {
  buildCompanyOptions,
  useDeleteJob,
  useJobFilters,
  useJobsQuery,
} from "@/hooks/jobs";
import { getApiErrorMessage } from "@/lib/api/error-message";

import type { Job, JobsQueryParams } from "@/types/jobs.types";

type JobFormState =
  | { mode: "create" }
  | { mode: "edit"; job: Job }
  | null;

export function JobsContent() {
  const [page, setPage] = useState(1);

  const [formState, setFormState] = useState<JobFormState>(null);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Any filter change returns the user to the first page. Resetting inside the
  // change handler (instead of an effect) avoids a cascading extra render.
  const filters = useJobFilters({ onChange: () => setPage(1) });

  const queryParams = useMemo<JobsQueryParams>(
    () => ({ page, limit: DEFAULT_JOBS_PAGE_SIZE, ...filters.params }),
    [page, filters.params],
  );

  const jobsQuery = useJobsQuery(queryParams);
  const deleteJob = useDeleteJob();

  const jobs = useMemo(() => jobsQuery.data?.items ?? [], [jobsQuery.data]);
  const meta = jobsQuery.data?.meta;
  const companyOptions = useMemo(() => buildCompanyOptions(jobs), [jobs]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleteError(null);
    try {
      await deleteJob.mutateAsync(deleteTarget.id);

      // Step back a page if the last item on a non-first page was removed.
      if (jobs.length === 1 && page > 1) {
        setPage((current) => current - 1);
      }

      setDeleteTarget(null);
    } catch (error) {
      setDeleteError(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <JobsHeader onAddJob={() => setFormState({ mode: "create" })} />

      <Card className="rounded-xl shadow-sm">
        <CardContent className="space-y-6 p-6">
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

          <JobsList
            jobs={jobs}
            isLoading={jobsQuery.isLoading}
            isError={jobsQuery.isError}
            errorMessage={getApiErrorMessage(jobsQuery.error)}
            isFetching={jobsQuery.isFetching}
            hasActiveFilters={filters.hasActiveFilters}
            page={page}
            totalPages={meta?.totalPages ?? 0}
            onPageChange={setPage}
            onRetry={() => void jobsQuery.refetch()}
            onEdit={(job) => setFormState({ mode: "edit", job })}
            onDelete={(job) => {
              setDeleteError(null);
              setDeleteTarget(job);
            }}
          />
        </CardContent>
      </Card>

      {formState ? (
        <JobFormDrawer
          mode={formState.mode}
          job={formState.mode === "edit" ? formState.job : undefined}
          onClose={() => setFormState(null)}
        />
      ) : null}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        title="Delete job"
        description={
          deleteTarget
            ? `Delete "${deleteTarget.title}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        destructive
        isLoading={deleteJob.isPending}
        errorMessage={deleteError}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
