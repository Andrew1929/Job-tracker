"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isDateTimeLocalKey, toDateTimeLocalKey } from "@/lib/date/date-time";
import { formatInterviewSchedule } from "@/lib/interviews/format-interview";

import type { Interview } from "@/types/interviews.types";

type InterviewRescheduleDialogProps = {
  interview: Interview;
  isLoading?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  /** Receives the new slot as the `YYYY-MM-DDTHH:mm` value the input produced. */
  onConfirm: (scheduledAtLocalKey: string) => void;
};

const INPUT_ID = "interview-reschedule-at";
const ERROR_ID = "interview-reschedule-at-error";

/**
 * Focused date/time picker built on the same Dialog shell as `ConfirmDialog`.
 * The parent mounts it per interview, so the initial value is read once.
 */
export function InterviewRescheduleDialog({
  interview,
  isLoading = false,
  errorMessage,
  onClose,
  onConfirm,
}: InterviewRescheduleDialogProps) {
  const [value, setValue] = useState(
    () => toDateTimeLocalKey(interview.scheduledAt) ?? "",
  );
  const [touched, setTouched] = useState(false);

  const isValid = isDateTimeLocalKey(value);
  const validationMessage =
    touched && !isValid ? "Enter a valid date and time" : null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);

    if (isValid) {
      onConfirm(value);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next && !isLoading) {
          onClose();
        }
      }}
    >
      <DialogContent showCloseButton={!isLoading}>
        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
          <DialogHeader>
            <DialogTitle>Reschedule interview</DialogTitle>
            <DialogDescription>
              {interview.job.title}
              {interview.job.company ? ` · ${interview.job.company.name}` : ""}
              {" — currently "}
              {formatInterviewSchedule(interview.scheduledAt)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor={INPUT_ID}>New date and time</Label>
            <Input
              id={INPUT_ID}
              type="datetime-local"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={Boolean(validationMessage)}
              aria-describedby={validationMessage ? ERROR_ID : undefined}
              disabled={isLoading}
            />
            {validationMessage ? (
              <p id={ERROR_ID} className="text-sm text-destructive" role="alert">
                {validationMessage}
              </p>
            ) : null}
          </div>

          {errorMessage ? (
            <p
              className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} aria-busy={isLoading}>
              {isLoading ? "Working…" : "Reschedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
