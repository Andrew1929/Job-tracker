import { Prisma } from '../../../../generated/prisma/client';

const COMPANY_SUMMARY_SELECT = {
  id: true,
  name: true,
  website: true,
} satisfies Prisma.CompanySelect;

export const JOB_LIST_SELECT = {
  id: true,
  title: true,
  status: true,
  appliedAt: true,
  url: true,
  createdAt: true,
  updatedAt: true,
  company: { select: COMPANY_SUMMARY_SELECT },
} satisfies Prisma.JobSelect;

export const JOB_DETAIL_SELECT = {
  id: true,
  title: true,
  description: true,
  status: true,
  appliedAt: true,
  url: true,
  createdAt: true,
  updatedAt: true,
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
