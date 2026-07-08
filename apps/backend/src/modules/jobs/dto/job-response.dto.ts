import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { JobStatus } from '../../../../generated/prisma/client';
import { JobDetail, JobListItem } from '../types/job.types';

@Exclude()
export class CompanyResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  website!: string | null;

  @Expose()
  description?: string | null;
}

@Exclude()
export class JobResponseDto {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  description?: string | null;

  @Expose()
  status!: JobStatus;

  @Expose()
  appliedAt!: Date | null;

  @Expose()
  url!: string | null;

  @Expose()
  @Type(() => CompanyResponseDto)
  company!: CompanyResponseDto | null;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  static fromEntity(job: JobListItem | JobDetail): JobResponseDto {
    return plainToInstance(JobResponseDto, job);
  }
}

@Exclude()
export class PaginationMetaDto {
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
export class PaginatedJobsResponseDto {
  @Expose()
  @Type(() => JobResponseDto)
  items!: JobResponseDto[];

  @Expose()
  @Type(() => PaginationMetaDto)
  meta!: PaginationMetaDto;

  static create(
    jobs: JobListItem[],
    pagination: { page: number; limit: number; total: number },
  ): PaginatedJobsResponseDto {
    const { page, limit, total } = pagination;
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

    return plainToInstance(PaginatedJobsResponseDto, {
      items: jobs.map((job) => JobResponseDto.fromEntity(job)),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  }
}
