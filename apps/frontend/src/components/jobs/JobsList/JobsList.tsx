"use client";

import { Briefcase } from "lucide-react";

import { JobsTable } from "@/components/jobs/JobsTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { Skeleton } from "@/components/shared/Skeleton";
import { cn } from "@/lib/utils";

import type { Job } from "@/types/jobs.types";

type JobsListProps = {
  jobs: Job[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  isFetching: boolean;
  hasActiveFilters: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
};

const SKELETON_ROW_COUNT = 6;

function JobsListSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="hidden h-5 w-32 sm:block" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="hidden h-5 w-24 sm:block" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function JobsList({
  jobs,
  isLoading,
  isError,
  errorMessage,
  isFetching,
  hasActiveFilters,
  page,
  totalPages,
  onPageChange,
  onRetry,
  onEdit,
  onDelete,
}: JobsListProps) {
  if (isLoading) {
    return <JobsListSkeleton />;
  }

  if (isError) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title={hasActiveFilters ? "No jobs match your filters" : "No jobs yet"}
        description={
          hasActiveFilters
            ? "Try adjusting your search or filters."
            : "Add your first job to start tracking your applications."
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={cn("transition-opacity", isFetching && "opacity-60")}
        aria-busy={isFetching}
      >
        <JobsTable jobs={jobs} onEdit={onEdit} onDelete={onDelete} />
      </div>

      {totalPages > 1 ? (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}
