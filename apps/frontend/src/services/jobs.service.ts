import { JOBS_API_PATHS } from "@/constants/jobs.constants";
import { apiRequest } from "@/lib/api/api-client";
import type {
  CreateJobInput,
  Job,
  JobsQueryParams,
  PaginatedJobs,
  UpdateJobInput,
} from "@/types/jobs.types";

export function getJobs(
  params: JobsQueryParams,
  signal?: AbortSignal,
): Promise<PaginatedJobs> {
  return apiRequest<PaginatedJobs>(JOBS_API_PATHS.list, {
    query: {
      page: params.page,
      limit: params.limit,
      search: params.search,
      status: params.status,
      companyId: params.companyId,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    },
    signal,
  });
}

export function getJob(id: string, signal?: AbortSignal): Promise<Job> {
  return apiRequest<Job>(JOBS_API_PATHS.byId(id), { signal });
}

export function createJob(input: CreateJobInput): Promise<Job> {
  return apiRequest<Job>(JOBS_API_PATHS.list, {
    method: "POST",
    body: input,
  });
}

export function updateJob(id: string, input: UpdateJobInput): Promise<Job> {
  return apiRequest<Job>(JOBS_API_PATHS.byId(id), {
    method: "PATCH",
    body: input,
  });
}

export function deleteJob(id: string): Promise<void> {
  return apiRequest<void>(JOBS_API_PATHS.byId(id), { method: "DELETE" });
}
