import { Prisma } from '../../../../generated/prisma/client';

const COMPANY_SUMMARY_SELECT = {
  id: true,
  name: true,
  website: true,
} satisfies Prisma.CompanySelect;

const JOB_CORE_SELECT = {
  id: true,
  title: true,
  status: true,
  priority: true,
  source: true,
  location: true,
  remoteType: true,
  employmentType: true,
  salaryMin: true,
  salaryMax: true,
  salaryCurrency: true,
  appliedAt: true,
  nextActionDate: true,
  url: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.JobSelect;

export const JOB_LIST_SELECT = {
  ...JOB_CORE_SELECT,
  company: { select: COMPANY_SUMMARY_SELECT },
} satisfies Prisma.JobSelect;

export const JOB_DETAIL_SELECT = {
  ...JOB_CORE_SELECT,
  description: true,
  company: {
    select: { ...COMPANY_SUMMARY_SELECT, description: true },
  },
} satisfies Prisma.JobSelect;

export type JobListItem = Prisma.JobGetPayload<{
  select: typeof JOB_LIST_SELECT;
}>;

export type JobDetail = Prisma.JobGetPayload<{
  select: typeof JOB_DETAIL_SELECT;
}>;

export interface PaginatedJobs {
  items: JobListItem[];
  total: number;
}
