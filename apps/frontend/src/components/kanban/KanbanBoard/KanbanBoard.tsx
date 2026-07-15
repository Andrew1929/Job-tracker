"use client";

import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/Skeleton";
import { KANBAN_COLUMNS } from "@/constants/kanban.constants";
import { useHorizontalWheelScroll } from "@/hooks/kanban/useHorizontalWheelScroll";
import { cn } from "@/lib/utils";

import type { Job, JobStatus } from "@/types/jobs.types";

type KanbanBoardProps = {
  jobs: Job[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  isFetching: boolean;
  onRetry: () => void;
  onCardMove: (jobId: string, status: JobStatus) => void;
  onAddJob: (status: JobStatus) => void;
};

const BOARD_HEIGHT = "h-[calc(100dvh-16rem)] min-h-[24rem]";
const SKELETON_CARDS_PER_COLUMN = 3;

function groupJobsByStatus(jobs: Job[]): Record<JobStatus, Job[]> {
  const grouped = Object.fromEntries(
    KANBAN_COLUMNS.map((status) => [status, [] as Job[]]),
  ) as Record<JobStatus, Job[]>;

  for (const job of jobs) {
    grouped[job.status]?.push(job);
  }

  return grouped;
}

function KanbanBoardSkeleton() {
  return (
    <div className={cn("flex gap-4", BOARD_HEIGHT)} aria-hidden="true">
      {KANBAN_COLUMNS.map((status) => (
        <div
          key={status}
          className="flex w-72 shrink-0 flex-col gap-3 rounded-xl border border-dashed border-border bg-muted/40 p-3"
        >
          <Skeleton className="h-5 w-24" />
          {Array.from({ length: SKELETON_CARDS_PER_COLUMN }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function KanbanBoard({
  jobs,
  isLoading,
  isError,
  errorMessage,
  isFetching,
  onRetry,
  onCardMove,
  onAddJob,
}: KanbanBoardProps) {
  const scrollRef = useHorizontalWheelScroll<HTMLDivElement>();

  if (isLoading) {
    return <KanbanBoardSkeleton />;
  }

  if (isError) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  const jobsByStatus = groupJobsByStatus(jobs);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex gap-4 overflow-x-auto scroll-smooth pb-2 transition-opacity",
        BOARD_HEIGHT,
        isFetching && "opacity-70",
      )}
      aria-busy={isFetching}
    >
      {KANBAN_COLUMNS.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          jobs={jobsByStatus[status]}
          onCardMove={onCardMove}
          onAddJob={onAddJob}
        />
      ))}
    </div>
  );
}
