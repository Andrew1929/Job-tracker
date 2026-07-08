"use client";

import { useQuery } from "@tanstack/react-query";

import { jobKeys } from "@/lib/query/query-keys";
import { getJob } from "@/services/jobs.service";

export function useJobQuery(id: string) {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: ({ signal }) => getJob(id, signal),
    enabled: id.length > 0,
  });
}
