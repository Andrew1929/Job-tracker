import { Prisma } from '../../../../generated/prisma/client';

const INTERVIEW_JOB_SUMMARY_SELECT = {
  id: true,
  title: true,
  company: { select: { id: true, name: true } },
} satisfies Prisma.JobSelect;

export const INTERVIEW_SELECT = {
  id: true,
  type: true,
  status: true,
  result: true,
  scheduledAt: true,
  completedAt: true,
  durationMinutes: true,
  remoteType: true,
  location: true,
  interviewers: true,
  prepNotes: true,
  feedback: true,
  rating: true,
  difficulty: true,
  jobId: true,
  createdAt: true,
  updatedAt: true,
  job: { select: INTERVIEW_JOB_SUMMARY_SELECT },
} satisfies Prisma.InterviewSelect;

export type InterviewDetail = Prisma.InterviewGetPayload<{
  select: typeof INTERVIEW_SELECT;
}>;

export interface PaginatedInterviews {
  items: InterviewDetail[];
  total: number;
}
