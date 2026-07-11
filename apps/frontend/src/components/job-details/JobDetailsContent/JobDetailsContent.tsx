"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { JobFormDrawer } from "@/components/jobs/JobFormDrawer";
import { JobPriorityBadge } from "@/components/jobs/JobPriorityBadge";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EMPLOYMENT_TYPE_LABELS,
  JOBS_ROUTES,
  JOB_SOURCE_LABELS,
  REMOTE_TYPE_LABELS,
} from "@/constants/jobs.constants";
import { useDeleteJob, useJobQuery } from "@/hooks/jobs";
import { getApiErrorMessage, isNotFoundError } from "@/lib/api/error-message";
import { formatDateValue } from "@/lib/format/date";
import { formatSalaryRange } from "@/lib/format/salary";

import type { Job } from "@/types/jobs.types";

type JobDetailsContentProps = {
  jobId: string;
};

function BackLink() {
  return (
    <Link
      href={JOBS_ROUTES.list}
      className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Back to Jobs
    </Link>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[160px_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

export function JobDetailsContent({ jobId }: JobDetailsContentProps) {
  const router = useRouter();
  const jobQuery = useJobQuery(jobId);
  const deleteJob = useDeleteJob();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (jobQuery.isLoading) {
    return (
      <div className="space-y-6">
        <BackLink />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (jobQuery.isError) {
    return (
      <div className="space-y-6">
        <BackLink />
        {isNotFoundError(jobQuery.error) ? (
          <EmptyState
            title="Job not found"
            description="This job may have been deleted or does not exist."
          />
        ) : (
          <ErrorState
            message={getApiErrorMessage(jobQuery.error)}
            onRetry={() => void jobQuery.refetch()}
          />
        )}
      </div>
    );
  }

  const job = jobQuery.data as Job;

  const handleConfirmDelete = async () => {
    setDeleteError(null);
    try {
      await deleteJob.mutateAsync(job.id);
      router.push(JOBS_ROUTES.list);
    } catch (error) {
      setDeleteError(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <BackLink />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {job.title}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {job.company?.name ?? "No company"}
            </span>
            <JobStatusBadge status={job.status} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditOpen(true)}
          >
            <Pencil />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              setDeleteError(null);
              setIsDeleteOpen(true);
            }}
          >
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Job information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <DetailRow label="Status">
              <JobStatusBadge status={job.status} />
            </DetailRow>
            <DetailRow label="Priority">
              <JobPriorityBadge priority={job.priority} />
            </DetailRow>
            <DetailRow label="Company">
              {job.company?.name ?? "—"}
            </DetailRow>
            <DetailRow label="Location">{job.location ?? "—"}</DetailRow>
            <DetailRow label="Work mode">
              {job.remoteType ? REMOTE_TYPE_LABELS[job.remoteType] : "—"}
            </DetailRow>
            <DetailRow label="Employment type">
              {job.employmentType
                ? EMPLOYMENT_TYPE_LABELS[job.employmentType]
                : "—"}
            </DetailRow>
            <DetailRow label="Source">
              {job.source ? JOB_SOURCE_LABELS[job.source] : "—"}
            </DetailRow>
            <DetailRow label="Salary">
              {formatSalaryRange(
                job.salaryMin,
                job.salaryMax,
                job.salaryCurrency,
              )}
            </DetailRow>
            <DetailRow label="Applied date">
              {formatDateValue(job.appliedAt)}
            </DetailRow>
            <DetailRow label="Next action date">
              {formatDateValue(job.nextActionDate)}
            </DetailRow>
            <DetailRow label="Posting URL">
              {job.url ? (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary hover:underline"
                >
                  {job.url}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              ) : (
                "—"
              )}
            </DetailRow>
            <DetailRow label="Description">
              {job.description ? (
                <span className="whitespace-pre-line">{job.description}</span>
              ) : (
                "—"
              )}
            </DetailRow>
            <DetailRow label="Created">
              {formatDateValue(job.createdAt)}
            </DetailRow>
            <DetailRow label="Last updated">
              {formatDateValue(job.updatedAt)}
            </DetailRow>
          </dl>
        </CardContent>
      </Card>

      {isEditOpen ? (
        <JobFormDrawer
          mode="edit"
          job={job}
          onClose={() => setIsEditOpen(false)}
        />
      ) : null}

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete job"
        description={`Delete "${job.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        isLoading={deleteJob.isPending}
        errorMessage={deleteError}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
