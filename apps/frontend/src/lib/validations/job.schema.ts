import { z } from "zod";

import {
  EMPLOYMENT_TYPES,
  JOB_PRIORITIES,
  JOB_SOURCES,
  JOB_STATUSES,
  REMOTE_TYPES,
  type CreateJobInput,
} from "@/types/jobs.types";

const TITLE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 5000;
const COMPANY_NAME_MAX_LENGTH = 200;
const LOCATION_MAX_LENGTH = 200;
const URL_MAX_LENGTH = 2048;

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Optional enum selects submit "" when cleared; accept it and normalize later.
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.enum(values), z.literal("")]);

const optionalDateString = z
  .string()
  .refine((value) => value === "" || !Number.isNaN(Date.parse(value)), {
    message: "Enter a valid date",
  });

const optionalWholeNumber = z
  .string()
  .trim()
  .refine((value) => value === "" || /^\d+$/.test(value), {
    message: "Enter a valid whole number",
  });

export const jobFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(
        TITLE_MAX_LENGTH,
        `Title must be at most ${TITLE_MAX_LENGTH} characters`,
      ),
    companyName: z
      .string()
      .trim()
      .max(
        COMPANY_NAME_MAX_LENGTH,
        `Company must be at most ${COMPANY_NAME_MAX_LENGTH} characters`,
      ),
    status: z.enum(JOB_STATUSES),
    priority: z.enum(JOB_PRIORITIES),
    source: optionalEnum(JOB_SOURCES),
    employmentType: optionalEnum(EMPLOYMENT_TYPES),
    remoteType: optionalEnum(REMOTE_TYPES),
    location: z
      .string()
      .trim()
      .max(
        LOCATION_MAX_LENGTH,
        `Location must be at most ${LOCATION_MAX_LENGTH} characters`,
      ),
    salaryMin: optionalWholeNumber,
    salaryMax: optionalWholeNumber,
    salaryCurrency: z
      .string()
      .trim()
      .refine((value) => value === "" || /^[A-Za-z]{3}$/.test(value), {
        message: "Use a 3-letter currency code (e.g. USD)",
      }),
    url: z
      .string()
      .trim()
      .max(URL_MAX_LENGTH, `URL must be at most ${URL_MAX_LENGTH} characters`)
      .refine((value) => value === "" || isValidHttpUrl(value), {
        message: "Enter a valid URL starting with http:// or https://",
      }),
    appliedAt: optionalDateString,
    nextActionDate: optionalDateString,
    description: z
      .string()
      .trim()
      .max(
        DESCRIPTION_MAX_LENGTH,
        `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters`,
      ),
  })
  .refine(
    (values) =>
      values.salaryMin === "" ||
      values.salaryMax === "" ||
      Number(values.salaryMin) <= Number(values.salaryMax),
    {
      message: "Minimum salary cannot exceed maximum salary",
      path: ["salaryMax"],
    },
  );

export type JobFormValues = z.infer<typeof jobFormSchema>;

export const EMPTY_JOB_FORM_VALUES: JobFormValues = {
  title: "",
  companyName: "",
  status: "SAVED",
  priority: "MEDIUM",
  source: "",
  employmentType: "",
  remoteType: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "",
  url: "",
  appliedAt: "",
  nextActionDate: "",
  description: "",
};

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function toIsoDate(value: string): string | undefined {
  return value ? new Date(value).toISOString() : undefined;
}

function toWholeNumber(value: string): number | undefined {
  return value ? Number(value) : undefined;
}

export function toJobInput(values: JobFormValues): CreateJobInput {
  return {
    title: values.title.trim(),
    companyName: emptyToUndefined(values.companyName),
    status: values.status,
    priority: values.priority,
    source: values.source || undefined,
    employmentType: values.employmentType || undefined,
    remoteType: values.remoteType || undefined,
    location: emptyToUndefined(values.location),
    salaryMin: toWholeNumber(values.salaryMin),
    salaryMax: toWholeNumber(values.salaryMax),
    salaryCurrency: emptyToUndefined(values.salaryCurrency)?.toUpperCase(),
    url: emptyToUndefined(values.url),
    description: emptyToUndefined(values.description),
    appliedAt: toIsoDate(values.appliedAt),
    nextActionDate: toIsoDate(values.nextActionDate),
  };
}
