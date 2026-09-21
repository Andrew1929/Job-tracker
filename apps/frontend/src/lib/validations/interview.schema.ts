import { z } from "zod";

import {
  INTERVIEW_INTERVIEWER_MAX_LENGTH,
  INTERVIEW_LOCATION_MAX_LENGTH,
  INTERVIEW_MAX_DURATION_MINUTES,
  INTERVIEW_MAX_INTERVIEWERS,
  INTERVIEW_NOTES_MAX_LENGTH,
  INTERVIEW_RATING_MAX,
  INTERVIEW_RATING_MIN,
} from "@/constants/interviews.constants";
import { isDateTimeLocalKey } from "@/lib/date/date-time";
import {
  INTERVIEW_RESULTS,
  INTERVIEW_STATUSES,
  INTERVIEW_TYPES,
} from "@/types/interviews.types";
import { REMOTE_TYPES } from "@/types/jobs.types";

// Optional enum selects submit "" when cleared; accept it and normalize later.
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.enum(values), z.literal("")]);

const optionalWholeNumber = z
  .string()
  .trim()
  .refine((value) => value === "" || /^\d+$/.test(value), {
    message: "Enter a valid whole number",
  });

/**
 * Splits the comma-separated interviewers field into the string array the API
 * stores. Exported because both the schema's limits and the submit payload
 * need the same reading of the raw input.
 */
export function splitInterviewerInput(value: string): string[] {
  return value
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

/** Rating and difficulty are 1–5 integers server-side, or left unset. */
function optionalScore() {
  return z
    .string()
    .refine(
      (value) =>
        value === "" ||
        (/^\d+$/.test(value) &&
          Number(value) >= INTERVIEW_RATING_MIN &&
          Number(value) <= INTERVIEW_RATING_MAX),
      {
        message: `Choose a value between ${INTERVIEW_RATING_MIN} and ${INTERVIEW_RATING_MAX}`,
      },
    );
}

export const interviewFormSchema = z.object({
  jobId: z.string().trim().min(1, "Select a job"),
  type: z.enum(INTERVIEW_TYPES),
  // `<input type="datetime-local">` submits `YYYY-MM-DDTHH:mm`, or "" when cleared.
  scheduledAt: z
    .string()
    .min(1, "Date and time are required")
    .refine((value) => isDateTimeLocalKey(value), {
      message: "Enter a valid date and time",
    }),
  durationMinutes: optionalWholeNumber.refine(
    (value) => value === "" || Number(value) <= INTERVIEW_MAX_DURATION_MINUTES,
    { message: `Duration must be at most ${INTERVIEW_MAX_DURATION_MINUTES} minutes` },
  ),
  remoteType: optionalEnum(REMOTE_TYPES),
  location: z
    .string()
    .trim()
    .max(
      INTERVIEW_LOCATION_MAX_LENGTH,
      `Location must be at most ${INTERVIEW_LOCATION_MAX_LENGTH} characters`,
    ),
  interviewers: z
    .string()
    .refine(
      (value) => splitInterviewerInput(value).length <= INTERVIEW_MAX_INTERVIEWERS,
      { message: `Add at most ${INTERVIEW_MAX_INTERVIEWERS} interviewers` },
    )
    .refine(
      (value) =>
        splitInterviewerInput(value).every(
          (name) => name.length <= INTERVIEW_INTERVIEWER_MAX_LENGTH,
        ),
      {
        message: `Each name must be at most ${INTERVIEW_INTERVIEWER_MAX_LENGTH} characters`,
      },
    ),
  prepNotes: z
    .string()
    .trim()
    .max(
      INTERVIEW_NOTES_MAX_LENGTH,
      `Notes must be at most ${INTERVIEW_NOTES_MAX_LENGTH} characters`,
    ),
  // Outcome fields are only editable once an interview exists, but they stay in
  // the single schema so create and edit can share one form component.
  status: z.enum(INTERVIEW_STATUSES),
  result: z.enum(INTERVIEW_RESULTS),
  rating: optionalScore(),
  difficulty: optionalScore(),
  feedback: z
    .string()
    .trim()
    .max(
      INTERVIEW_NOTES_MAX_LENGTH,
      `Feedback must be at most ${INTERVIEW_NOTES_MAX_LENGTH} characters`,
    ),
});

export type InterviewFormValues = z.infer<typeof interviewFormSchema>;

export const EMPTY_INTERVIEW_FORM_VALUES: InterviewFormValues = {
  jobId: "",
  type: "PHONE_SCREEN",
  scheduledAt: "",
  durationMinutes: "",
  remoteType: "",
  location: "",
  interviewers: "",
  prepNotes: "",
  status: "SCHEDULED",
  result: "PENDING",
  rating: "",
  difficulty: "",
  feedback: "",
};

// TODO(data): the form → API payload mappers live here once the data layer
// exists, mirroring `toJobInput` / `toJobUpdateInput` in `job.schema.ts`:
//
//   export function toInterviewInput(values: InterviewFormValues): CreateInterviewInput
//   export function toInterviewUpdateInput(values: InterviewFormValues): UpdateInterviewInput
//
// Points worth deciding there:
//   - `scheduledAt` must go through `dateTimeLocalKeyToIso`.
//   - Create should omit `status`/`result` and let the API defaults apply.
//   - Update must omit `jobId`: the API treats it as immutable.
//   - `UpdateInterviewDto` has no nullable fields, so a cleared optional value
//     cannot be sent as null; decide per field whether to send "" / [] or to
//     leave it unchanged.
