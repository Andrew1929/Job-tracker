"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { JobStatusSelect } from "@/components/job-details/JobStatusSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format/currency";

import type { JobStatus } from "@/types/job-status.types";
import type { JobDetails } from "@/types/jobs.types";

type JobInformationCardProps = {
  job: JobDetails;
  onStatusChange: (status: JobStatus) => void;
  onAddTag: (tag: string) => void;
};

type InfoRowProps = {
  label: string;
  children: React.ReactNode;
};

function InfoRow({ label, children }: InfoRowProps) {
  return (
    <div className="flex items-start gap-4">
      <dt className="w-28 shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 flex-1 text-sm text-foreground">{children}</dd>
    </div>
  );
}

export function JobInformationCard({
  job,
  onStatusChange,
  onAddTag,
}: JobInformationCardProps) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagDraft, setTagDraft] = useState("");

  const commitTag = () => {
    const tag = tagDraft.trim();
    if (tag) {
      onAddTag(tag);
    }
    setTagDraft("");
    setIsAddingTag(false);
  };

  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitTag();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setTagDraft("");
      setIsAddingTag(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Job Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <InfoRow label="Company">{job.company}</InfoRow>
          <InfoRow label="Position">{job.position}</InfoRow>
          <InfoRow label="Status">
            <JobStatusSelect
              id="job-information-status"
              value={job.status}
              onChange={onStatusChange}
            />
          </InfoRow>
          <InfoRow label="Location">{job.location}</InfoRow>
          <InfoRow label="Salary">{formatCurrency(job.salary)}</InfoRow>
          <InfoRow label="Applied Date">{job.appliedDate}</InfoRow>
          <InfoRow label="Job URL">
            <a
              href={job.jobPostingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block max-w-full truncate font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
            >
              {job.jobPostingUrl}
            </a>
          </InfoRow>
          <InfoRow label="Tags">
            <div className="flex flex-wrap items-center gap-2">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {tag}
                </span>
              ))}

              {isAddingTag ? (
                <input
                  type="text"
                  value={tagDraft}
                  onChange={(event) => setTagDraft(event.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={commitTag}
                  autoFocus
                  aria-label="New tag name"
                  className="h-7 w-28 rounded-md border border-input bg-background px-2 text-xs focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingTag(true)}
                  aria-label="Add tag"
                  className="inline-flex size-6 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Plus className="size-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </InfoRow>
        </dl>
      </CardContent>
    </Card>
  );
}
