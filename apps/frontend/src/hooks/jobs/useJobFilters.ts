"use client";

import { useMemo, useState } from "react";

import { ALL_FILTER_VALUE } from "@/constants/jobs.constants";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import type { SelectOption } from "@/types/select-option.types";
import type {
  Job,
  JobSortField,
  JobStatus,
  SortOrder,
} from "@/types/jobs.types";

const DEFAULT_SORT_VALUE = "createdAt:desc";

/** Filter + sort portion of `JobsQueryParams`, ready to merge with pagination. */
export type JobFilterParams = {
  search?: string;
  status?: JobStatus;
  companyId?: string;
  sortBy: JobSortField;
  sortOrder: SortOrder;
};

type UseJobFiltersOptions = {
  /** Called on any filter change (e.g. to reset pagination to the first page). */
  onChange?: () => void;
};

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

/** Builds the company filter options from the currently loaded jobs. */
export function buildCompanyOptions(jobs: Job[]): SelectOption[] {
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

/**
 * Owns the search/status/company/sort filter state shared by the jobs list and
 * the Kanban board, and derives the query params consumed by `useJobsQuery`.
 */
export function useJobFilters({ onChange }: UseJobFiltersOptions = {}) {
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE);
  const [companyFilter, setCompanyFilter] = useState(ALL_FILTER_VALUE);
  const [sortValue, setSortValue] = useState(DEFAULT_SORT_VALUE);

  const debouncedSearch = useDebouncedValue(searchInput);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    onChange?.();
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    onChange?.();
  };

  const handleCompanyFilterChange = (value: string) => {
    setCompanyFilter(value);
    onChange?.();
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
    onChange?.();
  };

  const params = useMemo<JobFilterParams>(() => {
    const { sortBy, sortOrder } = parseSortValue(sortValue);

    return {
      search: debouncedSearch.trim() || undefined,
      status:
        statusFilter === ALL_FILTER_VALUE
          ? undefined
          : (statusFilter as JobStatus),
      companyId: companyFilter === ALL_FILTER_VALUE ? undefined : companyFilter,
      sortBy,
      sortOrder,
    };
  }, [debouncedSearch, statusFilter, companyFilter, sortValue]);

  const hasActiveFilters =
    debouncedSearch.trim().length > 0 ||
    statusFilter !== ALL_FILTER_VALUE ||
    companyFilter !== ALL_FILTER_VALUE;

  return {
    searchInput,
    statusFilter,
    companyFilter,
    sortValue,
    handleSearchChange,
    handleStatusFilterChange,
    handleCompanyFilterChange,
    handleSortChange,
    params,
    hasActiveFilters,
  };
}
