import { z } from "zod";

import { JOB_STATUSES, type CreateJobInput } from "@/types/jobs.types";

const TITLE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 5000;
const COMPANY_NAME_MAX_LENGTH = 200;
const URL_MAX_LENGTH = 2048;

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const jobFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(TITLE_MAX_LENGTH, `Title must be at most ${TITLE_MAX_LENGTH} characters`),
  companyName: z
    .string()
    .trim()
    .max(
      COMPANY_NAME_MAX_LENGTH,
      `Company must be at most ${COMPANY_NAME_MAX_LENGTH} characters`,
    ),
  status: z.enum(JOB_STATUSES),
  url: z
    .string()
    .trim()
    .max(URL_MAX_LENGTH, `URL must be at most ${URL_MAX_LENGTH} characters`)
    .refine((value) => value === "" || isValidHttpUrl(value), {
      message: "Enter a valid URL starting with http:// or https://",
    }),
  appliedAt: z
    .string()
    .refine((value) => value === "" || !Number.isNaN(Date.parse(value)), {
      message: "Enter a valid date",
    }),
  description: z
    .string()
    .trim()
    .max(
      DESCRIPTION_MAX_LENGTH,
      `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters`,
    ),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

export const EMPTY_JOB_FORM_VALUES: JobFormValues = {
  title: "",
  companyName: "",
  status: "SAVED",
  url: "",
  appliedAt: "",
  description: "",
};

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function toJobInput(values: JobFormValues): CreateJobInput {
  return {
    title: values.title.trim(),
    companyName: emptyToUndefined(values.companyName),
    status: values.status,
    url: emptyToUndefined(values.url),
    description: emptyToUndefined(values.description),
    appliedAt: values.appliedAt
      ? new Date(values.appliedAt).toISOString()
      : undefined,
  };
}
