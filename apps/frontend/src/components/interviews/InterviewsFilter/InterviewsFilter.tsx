import { FilterSelect } from "@/components/shared/FilterSelect";
import { SearchInput } from "@/components/shared/SearchInput";
import {
  INTERVIEW_SORT_OPTIONS,
  INTERVIEW_STATUS_FILTER_OPTIONS,
  INTERVIEW_TYPE_FILTER_OPTIONS,
} from "@/constants/interviews.constants";
import { cn } from "@/lib/utils";

import type { SelectOption } from "@/types/select-option.types";

type InterviewsFilterProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  jobFilter: string;
  onJobFilterChange: (value: string) => void;
  jobOptions: readonly SelectOption[];
  sortValue: string;
  onSortChange: (value: string) => void;
  className?: string;
};

/**
 * Same row as `JobsFilters`: one search box followed by pill-style selects that
 * wrap onto their own lines on narrow screens.
 *
 * Status, job and sort map straight onto query parameters the interviews
 * endpoint accepts. Search and type do not exist server-side and are meant to
 * refine the loaded page on the client.
 */
export function InterviewsFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  jobFilter,
  onJobFilterChange,
  jobOptions,
  sortValue,
  onSortChange,
  className,
}: InterviewsFilterProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center",
        className,
      )}
    >
      <SearchInput
        placeholder="Search interviews..."
        ariaLabel="Search interviews"
        className="max-w-full sm:max-w-xs"
        value={searchQuery}
        onChange={onSearchChange}
      />
      <FilterSelect
        id="interviews-status-filter"
        prefix="Status"
        value={statusFilter}
        options={INTERVIEW_STATUS_FILTER_OPTIONS}
        onChange={onStatusFilterChange}
      />
      <FilterSelect
        id="interviews-type-filter"
        prefix="Type"
        value={typeFilter}
        options={INTERVIEW_TYPE_FILTER_OPTIONS}
        onChange={onTypeFilterChange}
      />
      <FilterSelect
        id="interviews-job-filter"
        prefix="Job"
        value={jobFilter}
        options={jobOptions}
        onChange={onJobFilterChange}
      />
      <FilterSelect
        id="interviews-sort"
        prefix="Date"
        value={sortValue}
        options={INTERVIEW_SORT_OPTIONS}
        onChange={onSortChange}
      />
    </div>
  );
}
