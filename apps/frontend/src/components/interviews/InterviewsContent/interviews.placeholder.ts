/**
 * TEMPORARY — UI preview data only.
 *
 * Lets the Interviews page render every state (scheduled, completed with and
 * without a result, cancelled) before the data layer exists. Delete this file
 * once `InterviewsContent` reads from real queries.
 *
 * Dates are fixed ISO strings rather than values computed from `new Date()`,
 * because this page is server-rendered first and a moving clock would make the
 * server and client markup disagree during hydration.
 */

import type { InterviewsSummaryCounts } from "@/components/interviews/InterviewsSummary";
import type { Interview } from "@/types/interviews.types";
import type { SelectOption } from "@/types/select-option.types";

const SPOTIFY_JOB = {
  id: "placeholder-job-spotify",
  title: "Frontend Developer",
  company: { id: "placeholder-company-spotify", name: "Spotify" },
};

const REVOLUT_JOB = {
  id: "placeholder-job-revolut",
  title: "React Engineer",
  company: { id: "placeholder-company-revolut", name: "Revolut" },
};

const MONZO_JOB = {
  id: "placeholder-job-monzo",
  title: "Senior Frontend Engineer",
  company: { id: "placeholder-company-monzo", name: "Monzo" },
};

const GRAMMARLY_JOB = {
  id: "placeholder-job-grammarly",
  title: "Full-stack Developer",
  company: { id: "placeholder-company-grammarly", name: "Grammarly" },
};

const PREPLY_JOB = {
  id: "placeholder-job-preply",
  title: "Product Engineer",
  company: { id: "placeholder-company-preply", name: "Preply" },
};

const TIMESTAMP = "2026-09-01T09:00:00.000Z";

export const PLACEHOLDER_INTERVIEWS: Interview[] = [
  {
    id: "placeholder-interview-1",
    type: "PHONE_SCREEN",
    status: "SCHEDULED",
    result: "PENDING",
    scheduledAt: "2026-09-23T09:30:00.000Z",
    completedAt: null,
    durationMinutes: 30,
    remoteType: "REMOTE",
    location: "Zoom",
    interviewers: ["Maria Kovalenko"],
    prepNotes: null,
    feedback: null,
    rating: null,
    difficulty: null,
    jobId: REVOLUT_JOB.id,
    job: REVOLUT_JOB,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
  {
    id: "placeholder-interview-2",
    type: "TECHNICAL",
    status: "SCHEDULED",
    result: "PENDING",
    scheduledAt: "2026-09-25T12:00:00.000Z",
    completedAt: null,
    durationMinutes: 90,
    remoteType: "REMOTE",
    location: "Google Meet",
    interviewers: ["Anna Berg", "Jonas Lind"],
    prepNotes:
      "Review React rendering and memoization.\nPrepare a walkthrough of the dashboard project.\nAsk about the team's release process.",
    feedback: null,
    rating: null,
    difficulty: null,
    jobId: SPOTIFY_JOB.id,
    job: SPOTIFY_JOB,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
  {
    id: "placeholder-interview-3",
    type: "SYSTEM_DESIGN",
    status: "SCHEDULED",
    result: "PENDING",
    scheduledAt: "2026-10-02T14:00:00.000Z",
    completedAt: null,
    durationMinutes: 60,
    remoteType: "HYBRID",
    location: "London office, 38 Finsbury Square",
    interviewers: [],
    prepNotes: null,
    feedback: null,
    rating: null,
    difficulty: null,
    jobId: MONZO_JOB.id,
    job: MONZO_JOB,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
  {
    id: "placeholder-interview-4",
    type: "HR",
    status: "CANCELLED",
    result: "PENDING",
    scheduledAt: "2026-09-18T10:00:00.000Z",
    completedAt: null,
    durationMinutes: null,
    remoteType: null,
    location: null,
    interviewers: [],
    prepNotes: null,
    feedback: null,
    rating: null,
    difficulty: null,
    jobId: PREPLY_JOB.id,
    job: PREPLY_JOB,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
  {
    id: "placeholder-interview-5",
    type: "TECHNICAL",
    status: "COMPLETED",
    result: "PASSED",
    scheduledAt: "2026-09-15T13:00:00.000Z",
    completedAt: "2026-09-15T14:10:00.000Z",
    durationMinutes: 60,
    remoteType: "REMOTE",
    location: "Microsoft Teams",
    interviewers: ["Olena Shevchuk", "Mark Davis"],
    prepNotes: "Brush up on TypeScript generics and API error handling.",
    feedback:
      "Good technical discussion, but system design answers could be more structured.",
    rating: 4,
    difficulty: 3,
    jobId: GRAMMARLY_JOB.id,
    job: GRAMMARLY_JOB,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
  {
    id: "placeholder-interview-6",
    type: "BEHAVIORAL",
    status: "COMPLETED",
    result: "PENDING",
    scheduledAt: "2026-09-10T11:00:00.000Z",
    completedAt: "2026-09-10T11:45:00.000Z",
    durationMinutes: 45,
    remoteType: "ONSITE",
    location: "Stockholm HQ",
    interviewers: ["Erik Nilsson"],
    prepNotes: null,
    feedback: null,
    rating: null,
    difficulty: null,
    jobId: SPOTIFY_JOB.id,
    job: SPOTIFY_JOB,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
];

/** Hand-counted from the rows above, relative to 2026-09-21. */
export const PLACEHOLDER_INTERVIEW_SUMMARY: InterviewsSummaryCounts = {
  upcoming: 3,
  thisWeek: 2,
  completed: 2,
  awaitingResult: 1,
};

/** Jobs as select options, `value` = job id. */
export const PLACEHOLDER_JOB_OPTIONS: readonly SelectOption[] = [
  SPOTIFY_JOB,
  REVOLUT_JOB,
  MONZO_JOB,
  GRAMMARLY_JOB,
  PREPLY_JOB,
].map((job) => ({
  value: job.id,
  label: `${job.title} · ${job.company.name}`,
}));
