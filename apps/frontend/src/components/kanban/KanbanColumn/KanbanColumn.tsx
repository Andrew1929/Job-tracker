"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { KanbanCard } from "@/components/kanban/KanbanCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { JOB_STATUS_LABELS } from "@/constants/jobs.constants";
import { cn } from "@/lib/utils";

import type { Job, JobStatus } from "@/types/jobs.types";

type KanbanColumnProps = {
  status: JobStatus;
  jobs: Job[];
  onCardMove: (jobId: string, status: JobStatus) => void;
  onAddJob: (status: JobStatus) => void;
};

export function KanbanColumn({
  status,
  jobs,
  onCardMove,
  onAddJob,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const label = JOB_STATUS_LABELS[status];

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDragLeave = (event: React.DragEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const jobId = event.dataTransfer.getData("text/plain");
    if (jobId) {
      onCardMove(jobId, status);
    }
  };

  return (
    <section
      aria-label={`${label} column`}
      onDragEnter={() => setIsDragOver(true)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex h-full w-72 shrink-0 flex-col rounded-xl border border-dashed border-border bg-muted/40 p-3 transition-colors",
        isDragOver && "border-primary bg-primary/5",
      )}
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-foreground">
          {label}{" "}
          <span className="font-normal text-muted-foreground">
            ({jobs.length})
          </span>
        </h2>
      </header>

      <ul
        data-kanban-column-body
        className="flex flex-1 flex-col gap-3 overflow-y-auto"
      >
        {jobs.length === 0 ? (
          <li>
            <EmptyState
              title="No jobs"
              description="Drag a card here or add one."
              className="py-8"
            />
          </li>
        ) : (
          jobs.map((job) => (
            <li key={job.id}>
              <KanbanCard job={job} />
            </li>
          ))
        )}
      </ul>

      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full border-dashed"
        onClick={() => onAddJob(status)}
      >
        <Plus />
        Add Job
      </Button>
    </section>
  );
}
