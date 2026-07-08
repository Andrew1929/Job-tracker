import { FilterSelect } from "@/components/shared/FilterSelect";
import { SearchInput } from "@/components/shared/SearchInput";
import {
  JOB_SORT_OPTIONS,
  JOB_STATUS_FILTER_OPTIONS,
} from "@/constants/jobs.constants";
import { cn } from "@/lib/utils";

import type { SelectOption } from "@/types/select-option.types";

type JobsFiltersProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  companyFilter: string;
  onCompanyFilterChange: (value: string) => void;
  companyOptions: readonly SelectOption[];
  sortValue: string;
  onSortChange: (value: string) => void;
  className?: string;
};

export function JobsFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  companyFilter,
  onCompanyFilterChange,
  companyOptions,
  sortValue,
  onSortChange,
  className,
}: JobsFiltersProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center",
        className,
      )}
    >
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
        options={companyOptions}
        onChange={onCompanyFilterChange}
      />
      <FilterSelect
        id="jobs-sort"
        prefix="Sort"
        value={sortValue}
        options={JOB_SORT_OPTIONS}
        onChange={onSortChange}
      />
    </div>
  );
}
