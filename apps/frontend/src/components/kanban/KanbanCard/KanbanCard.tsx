"use client";

import Link from "next/link";
import { useState } from "react";

import { JobPriorityBadge } from "@/components/jobs/JobPriorityBadge";
import { JOBS_ROUTES } from "@/constants/jobs.constants";
import { formatDateValue } from "@/lib/format/date";
import { cn } from "@/lib/utils";

import type { Job } from "@/types/jobs.types";

type KanbanCardProps = {
  job: Job;
};

export function KanbanCard({ job }: KanbanCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const companyName = job.company?.name ?? "—";

  const handleDragStart = (event: React.DragEvent<HTMLAnchorElement>) => {
    event.dataTransfer.setData("text/plain", job.id);
    event.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  return (
    <Link
      href={JOBS_ROUTES.details(job.id)}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={() => setIsDragging(false)}
      aria-label={`${job.title}${job.company ? ` at ${companyName}` : ""}`}
      className={cn(
        "block cursor-grab rounded-lg border border-border/60 bg-card p-3 shadow-sm transition hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:cursor-grabbing",
        isDragging && "opacity-50",
      )}
    >
      <h3 className="text-sm font-semibold text-foreground">{companyName}</h3>
      <p className="mt-1 text-sm text-foreground">{job.title}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {formatDateValue(job.appliedAt ?? job.createdAt)}
        </span>
        <JobPriorityBadge priority={job.priority} />
      </div>
    </Link>
  );
}
