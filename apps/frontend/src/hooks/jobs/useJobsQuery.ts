"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { jobKeys } from "@/lib/query/query-keys";
import { getJobs } from "@/services/jobs.service";
import type { JobsQueryParams } from "@/types/jobs.types";

export function useJobsQuery(params: JobsQueryParams) {
  return useQuery({
    queryKey: jobKeys.list(params),
    queryFn: ({ signal }) => getJobs(params, signal),
    placeholderData: keepPreviousData,
  });
}
