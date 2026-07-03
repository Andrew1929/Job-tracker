"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { JobAttachmentsCard } from "@/components/job-details/JobAttachmentsCard";
import { JobDetailsHeader } from "@/components/job-details/JobDetailsHeader";
import { JobInformationCard } from "@/components/job-details/JobInformationCard";
import { JobNotesCard } from "@/components/job-details/JobNotesCard";
import { JobTimelineCard } from "@/components/job-details/JobTimelineCard";
import { JobFormDrawer } from "@/components/jobs/JobFormDrawer";
import { JOBS_ROUTES } from "@/constants/jobs.constants";

import type { JobFormValues } from "@/lib/validations/job.schema";
import type { JobStatus } from "@/types/job-status.types";
import type { JobDetails } from "@/types/jobs.types";

type JobDetailsContentProps = {
  job: JobDetails;
};

function toJobFormValues(job: JobDetails): JobFormValues {
  return {
    company: job.company,
    position: job.position,
    status: job.status,
    salary: String(job.salary),
    jobPostingUrl: job.jobPostingUrl,
    location: job.location,
    notes: job.notes.join("\n"),
  };
}

export function JobDetailsContent({ job: initialJob }: JobDetailsContentProps) {
  const [job, setJob] = useState<JobDetails>(initialJob);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleStatusChange = (status: JobStatus) => {
    setJob((previous) => ({ ...previous, status }));
  };

  const handleAddTag = (tag: string) => {
    setJob((previous) =>
      previous.tags.includes(tag)
        ? previous
        : { ...previous, tags: [...previous.tags, tag] },
    );
  };

  const handleEditSubmit = (values: JobFormValues) => {
    setJob((previous) => ({
      ...previous,
      company: values.company,
      position: values.position,
      status: values.status,
      salary: Number(values.salary),
      location: values.location,
      jobPostingUrl: values.jobPostingUrl,
      notes: values.notes
        .split("\n")
        .map((note) => note.trim())
        .filter(Boolean),
    }));
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6">
      <Link
        href={JOBS_ROUTES.list}
        className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Jobs
      </Link>

      <JobDetailsHeader
        job={job}
        onStatusChange={handleStatusChange}
        onEdit={() => setIsEditOpen(true)}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <JobInformationCard
            job={job}
            onStatusChange={handleStatusChange}
            onAddTag={handleAddTag}
          />
          <JobNotesCard notes={job.notes} />
        </div>

        <div className="space-y-6">
          <JobTimelineCard timeline={job.timeline} />
          <JobAttachmentsCard attachments={job.attachments} />
        </div>
      </div>

      {isEditOpen ? (
        <JobFormDrawer
          mode="edit"
          initialValues={toJobFormValues(job)}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleEditSubmit}
        />
      ) : null}
    </div>
  );
}
