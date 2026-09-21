"use client";

import { MessagesSquare } from "lucide-react";

import { InterviewsTable } from "@/components/interviews/InterviewsTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { Skeleton } from "@/components/shared/Skeleton";
import { cn } from "@/lib/utils";

import type { Interview } from "@/types/interviews.types";

type InterviewsListProps = {
  interviews: Interview[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  isFetching: boolean;
  hasActiveFilters: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onOpenDetails: (interview: Interview) => void;
  onEdit: (interview: Interview) => void;
  onDelete: (interview: Interview) => void;
};

const SKELETON_ROW_COUNT = 6;

function InterviewsListSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="hidden h-5 w-24 sm:block" />
          <Skeleton className="hidden h-5 w-16 md:block" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/** Loading, error, empty and populated states for the list card, as in `JobsList`. */
export function InterviewsList({
  interviews,
  isLoading,
  isError,
  errorMessage,
  isFetching,
  hasActiveFilters,
  page,
  totalPages,
  onPageChange,
  onRetry,
  onOpenDetails,
  onEdit,
  onDelete,
}: InterviewsListProps) {
  if (isLoading) {
    return <InterviewsListSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        message={errorMessage}
        onRetry={onRetry}
        className="flex-1 py-6"
      />
    );
  }

  if (interviews.length === 0) {
    return (
      <EmptyState
        fill
        icon={MessagesSquare}
        title={
          hasActiveFilters
            ? "No interviews match your filters"
            : "No interviews yet"
        }
        description={
          hasActiveFilters
            ? "Try adjusting your search or filters."
            : "Add your first interview to keep track of your schedule and outcomes."
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
        <InterviewsTable
          interviews={interviews}
          onOpenDetails={onOpenDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
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
