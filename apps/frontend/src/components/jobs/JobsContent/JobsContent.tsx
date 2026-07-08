"use client";

import { useMemo, useState } from "react";

import { JobFormDrawer } from "@/components/jobs/JobFormDrawer";
import { JobsFilters } from "@/components/jobs/JobsFilters";
import { JobsHeader } from "@/components/jobs/JobsHeader";
import { JobsList } from "@/components/jobs/JobsList";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  ALL_FILTER_VALUE,
  DEFAULT_JOBS_PAGE_SIZE,
} from "@/constants/jobs.constants";
import { useDeleteJob, useJobsQuery } from "@/hooks/jobs";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getApiErrorMessage } from "@/lib/api/error-message";

import type { SelectOption } from "@/types/select-option.types";
import type {
  Job,
  JobsQueryParams,
  JobSortField,
  JobStatus,
  SortOrder,
} from "@/types/jobs.types";

const DEFAULT_SORT_VALUE = "createdAt:desc";

type JobFormState =
  | { mode: "create" }
  | { mode: "edit"; job: Job }
  | null;

function parseSortValue(value: string): {
  sortBy: JobSortField;
  sortOrder: SortOrder;
} {
  const [sortBy, sortOrder] = value.split(":");
  return {
    sortBy: sortBy as JobSortField,
    sortOrder: sortOrder as SortOrder,
  };
}

function buildCompanyOptions(jobs: Job[]): SelectOption[] {
  const uniqueCompanies = new Map<string, string>();
  for (const job of jobs) {
    if (job.company) {
      uniqueCompanies.set(job.company.id, job.company.name);
    }
  }

  return [
    { value: ALL_FILTER_VALUE, label: "All companies" },
    ...Array.from(uniqueCompanies, ([value, label]) => ({ value, label })),
  ];
}

export function JobsContent() {
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE);
  const [companyFilter, setCompanyFilter] = useState(ALL_FILTER_VALUE);
  const [sortValue, setSortValue] = useState(DEFAULT_SORT_VALUE);
  const [page, setPage] = useState(1);

  const [formState, setFormState] = useState<JobFormState>(null);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(searchInput);

  // Any filter change returns the user to the first page. Resetting inside the
  // handlers (instead of an effect) avoids a cascading extra render.
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleCompanyFilterChange = (value: string) => {
    setCompanyFilter(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
    setPage(1);
  };

  const queryParams = useMemo<JobsQueryParams>(() => {
    const { sortBy, sortOrder } = parseSortValue(sortValue);

    return {
      page,
      limit: DEFAULT_JOBS_PAGE_SIZE,
      search: debouncedSearch.trim() || undefined,
      status:
        statusFilter === ALL_FILTER_VALUE
          ? undefined
          : (statusFilter as JobStatus),
      companyId: companyFilter === ALL_FILTER_VALUE ? undefined : companyFilter,
      sortBy,
      sortOrder,
    };
  }, [page, debouncedSearch, statusFilter, companyFilter, sortValue]);

  const jobsQuery = useJobsQuery(queryParams);
  const deleteJob = useDeleteJob();

  const jobs = useMemo(() => jobsQuery.data?.items ?? [], [jobsQuery.data]);
  const meta = jobsQuery.data?.meta;
  const companyOptions = useMemo(() => buildCompanyOptions(jobs), [jobs]);

  const hasActiveFilters =
    debouncedSearch.trim().length > 0 ||
    statusFilter !== ALL_FILTER_VALUE ||
    companyFilter !== ALL_FILTER_VALUE;

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
            searchQuery={searchInput}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            companyFilter={companyFilter}
            onCompanyFilterChange={handleCompanyFilterChange}
            companyOptions={companyOptions}
            sortValue={sortValue}
            onSortChange={handleSortChange}
          />

          <JobsList
            jobs={jobs}
            isLoading={jobsQuery.isLoading}
            isError={jobsQuery.isError}
            errorMessage={getApiErrorMessage(jobsQuery.error)}
            isFetching={jobsQuery.isFetching}
            hasActiveFilters={hasActiveFilters}
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
