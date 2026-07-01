import type { JobListItem } from "@/types/jobs.types";
import type { SelectOption } from "@/types/select-option.types";

export const MOCK_JOBS: JobListItem[] = [
  {
    id: "1",
    company: "Google",
    position: "Frontend Developer",
    status: "Interview",
    appliedDate: "May 14, 2025",
    salary: 130_000,
  },
  {
    id: "2",
    company: "Amazon",
    position: "Software Engineer",
    status: "Applied",
    appliedDate: "May 12, 2025",
    salary: 145_000,
  },
  {
    id: "3",
    company: "Stripe",
    position: "Full Stack Developer",
    status: "Offer",
    appliedDate: "May 10, 2025",
    salary: 160_000,
  },
  {
    id: "4",
    company: "Meta",
    position: "React Developer",
    status: "Screening",
    appliedDate: "May 8, 2025",
    salary: 135_000,
  },
  {
    id: "5",
    company: "Netflix",
    position: "Senior Frontend Dev",
    status: "Rejected",
    appliedDate: "May 5, 2025",
    salary: 150_000,
  },
];

export const JOB_STATUS_FILTER_OPTIONS: readonly SelectOption[] = [
  { value: "all", label: "All" },
  { value: "interview", label: "Interview" },
  { value: "applied", label: "Applied" },
  { value: "offer", label: "Offer" },
  { value: "screening", label: "Screening" },
  { value: "rejected", label: "Rejected" },
];

export const JOB_COMPANY_FILTER_OPTIONS: readonly SelectOption[] = [
  { value: "all", label: "All" },
  { value: "google", label: "Google" },
  { value: "amazon", label: "Amazon" },
  { value: "stripe", label: "Stripe" },
  { value: "meta", label: "Meta" },
  { value: "netflix", label: "Netflix" },
];

export const JOBS_TOTAL_PAGES = 10;
