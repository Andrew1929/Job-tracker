"use client";

import {
  Ban,
  CalendarClock,
  CircleCheck,
  Clock,
  Pencil,
  Trash2,
} from "lucide-react";

import { InterviewResultBadge } from "@/components/interviews/InterviewResultBadge";
import { InterviewStatusBadge } from "@/components/interviews/InterviewStatusBadge";
import { Drawer } from "@/components/shared/Drawer";
import { Button } from "@/components/ui/button";
import { INTERVIEW_TYPE_LABELS } from "@/constants/interviews.constants";
import { REMOTE_TYPE_LABELS } from "@/constants/jobs.constants";
import { formatDateTime } from "@/lib/date/date-time";
import {
  formatInterviewDuration,
  formatInterviewers,
  formatInterviewSchedule,
  formatInterviewScore,
} from "@/lib/interviews/format-interview";
import { cn } from "@/lib/utils";

import type { Interview } from "@/types/interviews.types";

type InterviewDetailsDrawerProps = {
  interview: Interview;
  onClose: () => void;
  onEdit: (interview: Interview) => void;
  onReschedule: (interview: Interview) => void;
  onComplete: (interview: Interview) => void;
  onCancel: (interview: Interview) => void;
  onDelete: (interview: Interview) => void;
};

// Destructive actions reuse the outline + destructive text treatment the job
// details page gives its Delete button, so danger never outranks the primary.
const DESTRUCTIVE_OUTLINE_CLASS = "text-destructive hover:text-destructive";

function hasText(value: string | null): value is string {
  return value !== null && value.trim().length > 0;
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[120px_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

function DrawerSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 border-t border-border/60 pt-6">
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

/**
 * Right-side details panel. Scheduled interviews lead with scheduling actions;
 * completed ones lead with their outcome, and every section or row without a
 * value is left out instead of rendering an empty placeholder block.
 */
export function InterviewDetailsDrawer({
  interview,
  onClose,
  onEdit,
  onReschedule,
  onComplete,
  onCancel,
  onDelete,
}: InterviewDetailsDrawerProps) {
  const isScheduled = interview.status === "SCHEDULED";
  const isCompleted = interview.status === "COMPLETED";

  const hasOutcome =
    isCompleted ||
    interview.result !== "PENDING" ||
    interview.rating !== null ||
    interview.difficulty !== null ||
    hasText(interview.feedback);

  const outcomeSection = hasOutcome ? (
    <DrawerSection title="Result">
      <dl className="space-y-4">
        <DetailRow label="Result">
          <InterviewResultBadge result={interview.result} />
        </DetailRow>
        {interview.rating !== null ? (
          <DetailRow label="Rating">
            {formatInterviewScore(interview.rating)}
          </DetailRow>
        ) : null}
        {interview.difficulty !== null ? (
          <DetailRow label="Difficulty">
            {formatInterviewScore(interview.difficulty)}
          </DetailRow>
        ) : null}
        {interview.completedAt ? (
          <DetailRow label="Completed">
            {formatDateTime(interview.completedAt)}
          </DetailRow>
        ) : null}
        {hasText(interview.feedback) ? (
          <DetailRow label="Feedback">
            <span className="whitespace-pre-line">{interview.feedback}</span>
          </DetailRow>
        ) : null}
      </dl>
    </DrawerSection>
  ) : null;

  return (
    <Drawer title="Interview details" onClose={onClose}>
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-lg font-bold leading-tight text-foreground">
              {interview.job.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {interview.job.company?.name ?? "No company"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <InterviewStatusBadge status={interview.status} />
            {isCompleted ? (
              <InterviewResultBadge result={interview.result} />
            ) : null}
          </div>

          <p className="flex items-center gap-2 text-sm text-foreground">
            <Clock
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            {formatInterviewSchedule(interview.scheduledAt)}
          </p>
        </div>

        {/* A completed interview is about its outcome, so that comes first. */}
        {isCompleted ? outcomeSection : null}

        <DrawerSection title="Interview details">
          <dl className="space-y-4">
            <DetailRow label="Type">
              {INTERVIEW_TYPE_LABELS[interview.type]}
            </DetailRow>
            <DetailRow label="Date & time">
              {formatDateTime(interview.scheduledAt)}
            </DetailRow>
            {interview.durationMinutes ? (
              <DetailRow label="Duration">
                {formatInterviewDuration(interview.durationMinutes)}
              </DetailRow>
            ) : null}
            {interview.remoteType ? (
              <DetailRow label="Mode">
                {REMOTE_TYPE_LABELS[interview.remoteType]}
              </DetailRow>
            ) : null}
            {hasText(interview.location) ? (
              <DetailRow label="Location">{interview.location}</DetailRow>
            ) : null}
            {interview.interviewers.length > 0 ? (
              <DetailRow label="Interviewers">
                {formatInterviewers(interview.interviewers)}
              </DetailRow>
            ) : null}
          </dl>
        </DrawerSection>

        {hasText(interview.prepNotes) ? (
          <DrawerSection title="Preparation">
            <p className="whitespace-pre-line text-sm text-foreground">
              {interview.prepNotes}
            </p>
          </DrawerSection>
        ) : null}

        {!isCompleted ? outcomeSection : null}

        <div className="space-y-3 border-t border-border/60 pt-6">
          {isScheduled ? (
            <Button
              type="button"
              className="w-full"
              onClick={() => onComplete(interview)}
            >
              <CircleCheck />
              Mark as completed
            </Button>
          ) : null}

          {isCompleted ? (
            <Button
              type="button"
              className="w-full"
              onClick={() => onEdit(interview)}
            >
              <Pencil />
              Edit result
            </Button>
          ) : null}

          {/* Completed interviews are not rescheduled; their edit is the primary above. */}
          {!isCompleted ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onEdit(interview)}
              >
                <Pencil />
                Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onReschedule(interview)}
              >
                <CalendarClock />
                Reschedule
              </Button>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            {isScheduled ? (
              <Button
                type="button"
                variant="outline"
                className={cn("flex-1", DESTRUCTIVE_OUTLINE_CLASS)}
                onClick={() => onCancel(interview)}
              >
                <Ban />
                Cancel interview
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              className={cn("flex-1", DESTRUCTIVE_OUTLINE_CLASS)}
              onClick={() => onDelete(interview)}
            >
              <Trash2 />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
