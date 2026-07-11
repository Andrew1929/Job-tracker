"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { jobKeys, analyticsKeys } from "@/lib/query/query-keys";
import { createJob, deleteJob, updateJob } from "@/services/jobs.service";
import type {
  CreateJobInput,
  PaginatedJobs,
  UpdateJobInput,
} from "@/types/jobs.types";

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateJobInput) => createJob(input),
    onSuccess: (job) => {
      queryClient.setQueryData(jobKeys.detail(job.id), job);
      void queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateJobInput }) =>
      updateJob(id, input),
    onSuccess: (job) => {
      queryClient.setQueryData(jobKeys.detail(job.id), job);
      void queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    },
  });
}

type DeleteContext = {
  previousLists: [readonly unknown[], PaginatedJobs | undefined][];
};

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onMutate: async (id): Promise<DeleteContext> => {
      await queryClient.cancelQueries({ queryKey: jobKeys.lists() });

      const previousLists = queryClient.getQueriesData<PaginatedJobs>({
        queryKey: jobKeys.lists(),
      });

      for (const [key, data] of previousLists) {
        if (!data) {
          continue;
        }

        queryClient.setQueryData<PaginatedJobs>(key, {
          ...data,
          items: data.items.filter((job) => job.id !== id),
          meta: { ...data.meta, total: Math.max(0, data.meta.total - 1) },
        });
      }

      return { previousLists };
    },
    onError: (_error, _id, context) => {
      context?.previousLists.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: (_data, _error, id) => {
      queryClient.removeQueries({ queryKey: jobKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    },
  });
}
