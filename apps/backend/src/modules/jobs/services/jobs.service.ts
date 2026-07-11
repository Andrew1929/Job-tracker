import { Injectable, NotFoundException } from '@nestjs/common';
import {
  JobActivityType,
  JobStatus,
  Prisma,
} from '../../../../generated/prisma/client';
import { AnalyticsService } from '../../analytics/services/analytics.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { QueryJobsDto } from '../dto/query-jobs.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import {
  JobDetail,
  JOB_DETAIL_SELECT,
  JOB_LIST_SELECT,
  PaginatedJobs,
} from '../types/job.types';
import { CompaniesService } from './companies.service';

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companiesService: CompaniesService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  async create(userId: string, dto: CreateJobDto): Promise<JobDetail> {
    const job = await this.prisma.$transaction(async (tx) => {
      const companyId = await this.companiesService.resolveCompanyId(tx, dto);
      const status = dto.status ?? JobStatus.SAVED;

      return tx.job.create({
        data: {
          userId,
          title: dto.title,
          description: dto.description,
          status,
          priority: dto.priority,
          source: dto.source,
          location: dto.location,
          remoteType: dto.remoteType,
          employmentType: dto.employmentType,
          salaryMin: dto.salaryMin,
          salaryMax: dto.salaryMax,
          salaryCurrency: dto.salaryCurrency,
          url: dto.url,
          appliedAt: this.resolveAppliedAtOnCreate(status, dto.appliedAt),
          nextActionDate: dto.nextActionDate,
          companyId,
        },
        select: JOB_DETAIL_SELECT,
      });
    });

    await this.analyticsService.invalidateCache(userId);

    return job;
  }

  async findMany(userId: string, query: QueryJobsDto): Promise<PaginatedJobs> {
    const where = this.buildWhere(userId, query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.job.findMany({
        where,
        select: JOB_LIST_SELECT,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
      this.prisma.job.count({ where }),
    ]);

    return { items, total };
  }

  async findOne(userId: string, id: string): Promise<JobDetail> {
    const job = await this.prisma.job.findFirst({
      where: { id, userId },
      select: JOB_DETAIL_SELECT,
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateJobDto,
  ): Promise<JobDetail> {
    const job = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.job.findFirst({
        where: { id, userId },
        select: { id: true, status: true, appliedAt: true },
      });

      if (!existing) {
        throw new NotFoundException('Job not found');
      }

      const companyId = await this.companiesService.resolveCompanyId(tx, dto);
      const statusChanged =
        dto.status !== undefined && dto.status !== existing.status;
      const nextStatus = dto.status ?? existing.status;

      const job = await tx.job.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          status: dto.status,
          priority: dto.priority,
          source: dto.source,
          location: dto.location,
          remoteType: dto.remoteType,
          employmentType: dto.employmentType,
          salaryMin: dto.salaryMin,
          salaryMax: dto.salaryMax,
          salaryCurrency: dto.salaryCurrency,
          url: dto.url,
          appliedAt: this.resolveAppliedAtOnUpdate(
            existing.appliedAt,
            dto.appliedAt,
            nextStatus,
          ),
          nextActionDate: dto.nextActionDate,
          ...(companyId !== undefined && { companyId }),
        },
        select: JOB_DETAIL_SELECT,
      });

      if (statusChanged) {
        await this.recordStatusChange(tx, id, existing.status, nextStatus);
      }

      return job;
    });

    await this.analyticsService.invalidateCache(userId);

    return job;
  }

  async remove(userId: string, id: string): Promise<void> {
    const { count } = await this.prisma.job.deleteMany({
      where: { id, userId },
    });

    if (count === 0) {
      throw new NotFoundException('Job not found');
    }

    await this.analyticsService.invalidateCache(userId);
  }

  private buildWhere(
    userId: string,
    query: QueryJobsDto,
  ): Prisma.JobWhereInput {
    const { status, companyId, search } = query;

    return {
      userId,
      ...(status && { status }),
      ...(companyId && { companyId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };
  }

  private resolveAppliedAtOnCreate(
    status: JobStatus,
    appliedAt?: Date,
  ): Date | undefined {
    if (appliedAt !== undefined) {
      return appliedAt;
    }

    return status === JobStatus.APPLIED ? new Date() : undefined;
  }

  private resolveAppliedAtOnUpdate(
    currentAppliedAt: Date | null,
    appliedAt: Date | undefined,
    nextStatus: JobStatus,
  ): Date | undefined {
    if (appliedAt !== undefined) {
      return appliedAt;
    }

    if (nextStatus === JobStatus.APPLIED && currentAppliedAt === null) {
      return new Date();
    }

    return undefined;
  }

  private async recordStatusChange(
    tx: Prisma.TransactionClient,
    jobId: string,
    from: JobStatus,
    to: JobStatus,
  ): Promise<void> {
    await tx.jobActivity.create({
      data: {
        jobId,
        type: JobActivityType.STATUS_CHANGE,
        description: `Status changed from ${from} to ${to}`,
        fromStatus: from,
        toStatus: to,
      },
    });
  }
}
