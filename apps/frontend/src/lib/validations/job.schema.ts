import { z } from "zod";

import { JOB_STATUSES } from "@/types/job-status.types";

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export const jobFormSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  status: z.enum(JOB_STATUSES),
  salary: z
    .string()
    .min(1, "Salary is required")
    .regex(/^\d+$/, "Salary must be a whole number"),
  jobPostingUrl: z
    .string()
    .refine((value) => value === "" || isValidUrl(value), {
      message: "Please enter a valid URL",
    }),
  location: z.string(),
  notes: z.string(),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
