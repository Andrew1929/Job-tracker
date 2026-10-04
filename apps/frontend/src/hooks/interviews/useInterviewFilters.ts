import { ALL_FILTER_VALUE } from "@/constants/jobs.constants";
import { InterviewStatus } from "@/types/interviews.types"
import { useMemo, useState } from "react";
import { SortOrder } from "@/types/jobs.types";
import { useDebouncedValue } from "../useDebouncedValue";

const DEFAULT_SORT_VALUE = "asc";

export type InterviewFilterParams = {
  status?: InterviewStatus;
  jobId?: string;
  sortOrder: SortOrder
};

type UseInterviewFiltersOptions = {
  onChange?: () => void;
}

export function useInterviewFilters ({onChange} : UseInterviewFiltersOptions = {}) {
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE);
  const [typeFilter, setTypeFilter] = useState(ALL_FILTER_VALUE);
  const [jobFilter, setJobFilter] = useState(ALL_FILTER_VALUE);
  const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULT_SORT_VALUE);

  const debouncedSearch = useDebouncedValue(searchInput);
  
    const handleSearchChange = (value: string) => {
      setSearchInput(value);
      onChange?.();
    };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    onChange?.();
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    onChange?.();
  };

  const handleJobFilterChange = (value: string) => {
    setJobFilter(value);
    onChange?.();
  };

  const handleSortChange = (value: SortOrder) => {
    setSortOrder(value);
    onChange?.();
  };

  const params = useMemo<InterviewFilterParams>(() => {
    return {
      status:
        statusFilter === ALL_FILTER_VALUE
          ? undefined
          : (statusFilter as InterviewStatus),
      jobId: jobFilter === ALL_FILTER_VALUE ? undefined : jobFilter,
      sortOrder,
    }
  }, [statusFilter, jobFilter, sortOrder] );


  const hasActiveFilters = 
    debouncedSearch.trim().length > 0 ||
    statusFilter !== ALL_FILTER_VALUE ||
    typeFilter !== ALL_FILTER_VALUE ||
    jobFilter !== ALL_FILTER_VALUE ;

  return {
    searchInput,
    statusFilter,
    typeFilter,
    jobFilter,
    sortOrder,
    handleSearchChange,
    handleStatusFilterChange,
    handleTypeFilterChange,
    handleJobFilterChange,
    handleSortChange,
    params,
    hasActiveFilters,
  }
};