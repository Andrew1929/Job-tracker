import { Injectable, NotFoundException } from '@nestjs/common';
import { InterviewStatus, Prisma } from '../../../../generated/prisma/client';
import { NotificationScheduler } from '../../notification/services/notification-scheduler';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInterviewDto } from '../dto/create-interview.dto';
import { QueryInterviewsDto } from '../dto/query-interviews.dto';
import { UpdateInterviewDto } from '../dto/update-interview.dto';
import {
  INTERVIEW_SELECT,
  InterviewDetail,
  PaginatedInterviews,
} from '../types/interview.types';
import { getPaginationParams } from '../../../common/utils/pagination.util';

@Injectable()
export class InterviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scheduler: NotificationScheduler,
  ) {}

  async create(
    userId: string,
    dto: CreateInterviewDto,
  ): Promise<InterviewDetail> {
    const interview = await this.prisma.$transaction(async (tx) => {
      await this.assertJobOwnership(tx, userId, dto.jobId);

      const status = dto.status ?? InterviewStatus.SCHEDULED;

      return tx.interview.create({
        data: {
          userId,
          jobId: dto.jobId,
          type: dto.type,
          status,
          result: dto.result,
          scheduledAt: dto.scheduledAt,
          completedAt: this.resolveCompletedAt(null, dto.completedAt, status),
          durationMinutes: dto.durationMinutes,
          remoteType: dto.remoteType,
          location: dto.location,
          interviewers: dto.interviewers,
          prepNotes: dto.prepNotes,
          feedback: dto.feedback,
          rating: dto.rating,
          difficulty: dto.difficulty,
        },
        select: INTERVIEW_SELECT,
      });
    });

    await this.scheduler.syncInterview({
      id: interview.id,
      userId,
      status: interview.status,
      scheduledAt: interview.scheduledAt,
      completedAt: interview.completedAt,
    });

    return interview;
  }

  async findMany(
    userId: string,
    query: QueryInterviewsDto,
  ): Promise<PaginatedInterviews> {
    const where: Prisma.InterviewWhereInput = {
      userId,
      ...(query.jobId && { jobId: query.jobId }),
      ...(query.status && { status: query.status }),
    };
    const { skip, take } = getPaginationParams(query.page, query.limit);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.interview.findMany({
        where,
        select: INTERVIEW_SELECT,
        orderBy: { scheduledAt: query.sortOrder },
        skip,
        take,
      }),
      this.prisma.interview.count({ where }),
    ]);

    return { items, total };
  }

  async findOne(userId: string, id: string): Promise<InterviewDetail> {
    const interview = await this.prisma.interview.findFirst({
      where: { id, userId },
      select: INTERVIEW_SELECT,
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    return interview;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateInterviewDto,
  ): Promise<InterviewDetail> {
    const { interview, schedulingChanged } = await this.prisma.$transaction(
      async (tx) => {
        const existing = await tx.interview.findFirst({
          where: { id, userId },
          select: {
            id: true,
            status: true,
            scheduledAt: true,
            completedAt: true,
          },
        });

        if (!existing) {
          throw new NotFoundException('Interview not found');
        }

        const nextStatus = dto.status ?? existing.status;
        const completedAt = this.resolveCompletedAt(
          existing.completedAt,
          dto.completedAt,
          nextStatus,
        );

        const updated = await tx.interview.update({
          where: { id },
          data: {
            type: dto.type,
            status: dto.status,
            result: dto.result,
            scheduledAt: dto.scheduledAt,
            completedAt,
            durationMinutes: dto.durationMinutes,
            remoteType: dto.remoteType,
            location: dto.location,
            interviewers: dto.interviewers,
            prepNotes: dto.prepNotes,
            feedback: dto.feedback,
            rating: dto.rating,
            difficulty: dto.difficulty,
          },
          select: INTERVIEW_SELECT,
        });

        return {
          interview: updated,
          schedulingChanged:
            dto.scheduledAt !== undefined ||
            dto.status !== undefined ||
            completedAt !== undefined,
        };
      },
    );

    if (schedulingChanged) {
      await this.scheduler.syncInterview({
        id: interview.id,
        userId,
        status: interview.status,
        scheduledAt: interview.scheduledAt,
        completedAt: interview.completedAt,
      });
    }

    return interview;
  }

  async remove(userId: string, id: string): Promise<void> {
    const { count } = await this.prisma.interview.deleteMany({
      where: { id, userId },
    });

    if (count === 0) {
      throw new NotFoundException('Interview not found');
    }

    await this.scheduler.cancelInterviewJobs(id, userId);
  }

  private async assertJobOwnership(
    tx: Prisma.TransactionClient,
    userId: string,
    jobId: string,
  ): Promise<void> {
    const job = await tx.job.findFirst({
      where: { id: jobId, userId },
      select: { id: true },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }
  }

  /**
   * Keeps `completedAt` consistent with status: set when an interview first
   * becomes completed, cleared when it leaves the completed state, otherwise
   * left untouched (or set to an explicit client value).
   */
  private resolveCompletedAt(
    currentCompletedAt: Date | null,
    completedAt: Date | undefined,
    nextStatus: InterviewStatus,
  ): Date | null | undefined {
    if (completedAt !== undefined) {
      return completedAt;
    }

    if (
      nextStatus === InterviewStatus.COMPLETED &&
      currentCompletedAt === null
    ) {
      return new Date();
    }

    if (
      nextStatus !== InterviewStatus.COMPLETED &&
      currentCompletedAt !== null
    ) {
      return null;
    }

    return undefined;
  }
}
