import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { JobStatus } from '../../../../generated/prisma/client';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const SEARCH_MAX_LENGTH = 200;

export enum JobSortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  APPLIED_AT = 'appliedAt',
  NEXT_ACTION_DATE = 'nextActionDate',
  TITLE = 'title',
  STATUS = 'status',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryJobsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = DEFAULT_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  limit: number = DEFAULT_LIMIT;

  @IsOptional()
  @IsString()
  @MaxLength(SEARCH_MAX_LENGTH)
  search?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  // Inclusive lower bound for `nextActionDate`. Scheduled-action consumers such
  // as the calendar request only the range they render.
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  nextActionFrom?: Date;

  // Inclusive upper bound for `nextActionDate`.
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  nextActionTo?: Date;

  @IsOptional()
  @IsEnum(JobSortField)
  sortBy: JobSortField = JobSortField.CREATED_AT;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.DESC;
}
