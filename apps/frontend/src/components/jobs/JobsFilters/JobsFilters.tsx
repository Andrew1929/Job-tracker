import { JobsViewToggle } from "@/components/jobs/JobsViewToggle";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { SearchInput } from "@/components/shared/SearchInput";
import {
  JOB_COMPANY_FILTER_OPTIONS,
  JOB_STATUS_FILTER_OPTIONS,
} from "@/constants/jobs.constants";
import { cn } from "@/lib/utils";

import type { JobsViewMode } from "@/types/jobs.types";

type JobsFiltersProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  companyFilter: string;
  onCompanyFilterChange: (value: string) => void;
  viewMode: JobsViewMode;
  onViewModeChange: (mode: JobsViewMode) => void;
  className?: string;
};

export function JobsFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  companyFilter,
  onCompanyFilterChange,
  viewMode,
  onViewModeChange,
  className,
}: JobsFiltersProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchInput
          placeholder="Search jobs..."
          ariaLabel="Search jobs"
          className="max-w-full sm:max-w-xs"
          value={searchQuery}
          onChange={onSearchChange}
        />
        <FilterSelect
          id="jobs-status-filter"
          prefix="Status"
          value={statusFilter}
          options={JOB_STATUS_FILTER_OPTIONS}
          onChange={onStatusFilterChange}
        />
        <FilterSelect
          id="jobs-company-filter"
          prefix="Company"
          value={companyFilter}
          options={JOB_COMPANY_FILTER_OPTIONS}
          onChange={onCompanyFilterChange}
        />
      </div>

      <JobsViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
    </div>
  );
}
