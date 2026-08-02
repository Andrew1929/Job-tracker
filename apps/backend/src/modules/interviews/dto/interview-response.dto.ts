import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import {
  InterviewResult,
  InterviewStatus,
  InterviewType,
  RemoteType,
} from '../../../../generated/prisma/client';
import { buildPaginationMeta } from '../../../common/utils/pagination.util';
import { InterviewDetail, PaginatedInterviews } from '../types/interview.types';

@Exclude()
class InterviewCompanyDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;
}

@Exclude()
class InterviewJobSummaryDto {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  @Type(() => InterviewCompanyDto)
  company!: InterviewCompanyDto | null;
}

@Exclude()
export class InterviewResponseDto {
  @Expose()
  id!: string;

  @Expose()
  type!: InterviewType;

  @Expose()
  status!: InterviewStatus;

  @Expose()
  result!: InterviewResult;

  @Expose()
  scheduledAt!: Date;

  @Expose()
  completedAt!: Date | null;

  @Expose()
  durationMinutes!: number | null;

  @Expose()
  remoteType!: RemoteType | null;

  @Expose()
  location!: string | null;

  @Expose()
  interviewers!: string[];

  @Expose()
  prepNotes!: string | null;

  @Expose()
  feedback!: string | null;

  @Expose()
  rating!: number | null;

  @Expose()
  difficulty!: number | null;

  @Expose()
  jobId!: string;

  @Expose()
  @Type(() => InterviewJobSummaryDto)
  job!: InterviewJobSummaryDto;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  static fromEntity(interview: InterviewDetail): InterviewResponseDto {
    return plainToInstance(InterviewResponseDto, interview);
  }
}

@Exclude()
export class InterviewPaginationMetaDto {
  @Expose()
  page!: number;

  @Expose()
  limit!: number;

  @Expose()
  total!: number;

  @Expose()
  totalPages!: number;

  @Expose()
  hasNextPage!: boolean;

  @Expose()
  hasPreviousPage!: boolean;
}

@Exclude()
export class PaginatedInterviewsResponseDto {
  @Expose()
  @Type(() => InterviewResponseDto)
  items!: InterviewResponseDto[];

  @Expose()
  @Type(() => InterviewPaginationMetaDto)
  meta!: InterviewPaginationMetaDto;

  static create(
    { items, total }: PaginatedInterviews,
    pagination: { page: number; limit: number },
  ): PaginatedInterviewsResponseDto {
    return plainToInstance(PaginatedInterviewsResponseDto, {
      items: items.map((item) => InterviewResponseDto.fromEntity(item)),
      meta: buildPaginationMeta({ ...pagination, total }),
    });
  }
}
