import { JOB_STATUSES } from "@/types/job-status.types";

import type { JobDetails, JobListItem } from "@/types/jobs.types";
import type { SelectOption } from "@/types/select-option.types";

export const JOBS_ROUTES = {
  list: "/jobs",
  details: (id: string) => `/jobs/${id}`,
} as const;

export const MOCK_JOB_DETAILS: readonly JobDetails[] = [
  {
    id: "1",
    company: "Google",
    position: "Frontend Developer",
    status: "Interview",
    appliedDate: "May 14, 2026",
    salary: 130_000,
    companyInitial: "G",
    companyColor: "bg-blue-500",
    location: "Remote",
    jobPostingUrl: "https://careers.google.com/jobs/frontend-developer",
    tags: ["React", "TypeScript", "Next.js"],
    notes: [
      "Recruiter contacted me on May 12",
      "Have interview scheduled for May 16",
      "Prepare system design questions",
      "Focus on React and TypeScript",
    ],
    timeline: [
      { id: "applied", label: "Applied", date: "May 14, 2026", state: "completed" },
      { id: "screening", label: "Screening", date: "May 15, 2026", state: "completed" },
      { id: "interview", label: "Interview", date: "May 16, 2026", state: "current" },
      { id: "technical", label: "Technical", state: "upcoming" },
      { id: "offer", label: "Offer", state: "upcoming" },
      { id: "accepted", label: "Accepted", state: "upcoming" },
    ],
    attachments: [
      { id: "resume", name: "Resume.pdf" },
      { id: "portfolio", name: "Portfolio.pdf" },
    ],
  },
  {
    id: "2",
    company: "Amazon",
    position: "Software Engineer",
    status: "Applied",
    appliedDate: "May 12, 2026",
    salary: 145_000,
    companyInitial: "A",
    companyColor: "bg-orange-500",
    location: "Seattle, WA (Hybrid)",
    jobPostingUrl: "https://www.amazon.jobs/software-engineer",
    tags: ["AWS", "Node.js", "React"],
    notes: [
      "Applied via referral from Alex",
      "Follow up if no reply by May 20",
    ],
    timeline: [
      { id: "applied", label: "Applied", date: "May 12, 2026", state: "completed" },
      { id: "screening", label: "Screening", state: "current" },
      { id: "interview", label: "Interview", state: "upcoming" },
      { id: "technical", label: "Technical", state: "upcoming" },
      { id: "offer", label: "Offer", state: "upcoming" },
      { id: "accepted", label: "Accepted", state: "upcoming" },
    ],
    attachments: [{ id: "resume", name: "Resume.pdf" }],
  },
  {
    id: "3",
    company: "Stripe",
    position: "Full Stack Developer",
    status: "Offer",
    appliedDate: "May 10, 2026",
    salary: 160_000,
    companyInitial: "S",
    companyColor: "bg-indigo-500",
    location: "New York, NY",
    jobPostingUrl: "https://stripe.com/jobs/full-stack-developer",
    tags: ["React", "Ruby", "API"],
    notes: [
      "Offer received on May 28",
      "Negotiate equity before accepting",
    ],
    timeline: [
      { id: "applied", label: "Applied", date: "May 10, 2026", state: "completed" },
      { id: "screening", label: "Screening", date: "May 12, 2026", state: "completed" },
      { id: "interview", label: "Interview", date: "May 18, 2026", state: "completed" },
      { id: "technical", label: "Technical", date: "May 22, 2026", state: "completed" },
      { id: "offer", label: "Offer", date: "May 28, 2026", state: "current" },
      { id: "accepted", label: "Accepted", state: "upcoming" },
    ],
    attachments: [{ id: "resume", name: "Resume.pdf" }],
  },
  {
    id: "4",
    company: "Meta",
    position: "React Developer",
    status: "Screening",
    appliedDate: "May 8, 2026",
    salary: 135_000,
    companyInitial: "M",
    companyColor: "bg-blue-600",
    location: "Menlo Park, CA (Remote)",
    jobPostingUrl: "https://www.metacareers.com/jobs/react-developer",
    tags: ["React", "GraphQL", "Relay"],
    notes: ["Screening call scheduled for May 13"],
    timeline: [
      { id: "applied", label: "Applied", date: "May 8, 2026", state: "completed" },
      { id: "screening", label: "Screening", date: "May 13, 2026", state: "current" },
      { id: "interview", label: "Interview", state: "upcoming" },
      { id: "technical", label: "Technical", state: "upcoming" },
      { id: "offer", label: "Offer", state: "upcoming" },
      { id: "accepted", label: "Accepted", state: "upcoming" },
    ],
    attachments: [{ id: "resume", name: "Resume.pdf" }],
  },
  {
    id: "5",
    company: "Netflix",
    position: "Senior Frontend Dev",
    status: "Rejected",
    appliedDate: "May 5, 2026",
    salary: 150_000,
    companyInitial: "N",
    companyColor: "bg-red-600",
    location: "Los Gatos, CA",
    jobPostingUrl: "https://jobs.netflix.com/senior-frontend-dev",
    tags: ["React", "Node.js"],
    notes: ["Rejected after screening on May 9"],
    timeline: [
      { id: "applied", label: "Applied", date: "May 5, 2026", state: "completed" },
      { id: "screening", label: "Screening", date: "May 9, 2026", state: "completed" },
      { id: "interview", label: "Interview", state: "upcoming" },
      { id: "technical", label: "Technical", state: "upcoming" },
      { id: "offer", label: "Offer", state: "upcoming" },
      { id: "accepted", label: "Accepted", state: "upcoming" },
    ],
    attachments: [{ id: "resume", name: "Resume.pdf" }],
  },
];

export function findMockJobDetails(id: string): JobDetails | undefined {
  return MOCK_JOB_DETAILS.find((job) => job.id === id);
}

export const MOCK_JOBS: JobListItem[] = MOCK_JOB_DETAILS.map(
  ({ id, company, position, status, appliedDate, salary }) => ({
    id,
    company,
    position,
    status,
    appliedDate,
    salary,
  }),
);

export const JOB_STATUS_OPTIONS: readonly SelectOption[] = JOB_STATUSES.map(
  (status) => ({ value: status, label: status }),
);

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
