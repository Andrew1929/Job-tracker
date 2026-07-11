import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import {
  EmploymentType,
  JobPriority,
  JobSource,
  JobStatus,
  RemoteType,
} from '../../../../generated/prisma/client';

const TITLE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 5000;
const URL_MAX_LENGTH = 2048;
const COMPANY_NAME_MAX_LENGTH = 200;
const LOCATION_MAX_LENGTH = 200;
const CURRENCY_MAX_LENGTH = 3;
const SALARY_MIN = 0;

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(TITLE_MAX_LENGTH)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(DESCRIPTION_MAX_LENGTH)
  description?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsEnum(JobPriority)
  priority?: JobPriority;

  @IsOptional()
  @IsEnum(JobSource)
  source?: JobSource;

  @IsOptional()
  @IsString()
  @MaxLength(LOCATION_MAX_LENGTH)
  location?: string;

  @IsOptional()
  @IsEnum(RemoteType)
  remoteType?: RemoteType;

  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @IsOptional()
  @IsInt()
  @Min(SALARY_MIN)
  salaryMin?: number;

  @IsOptional()
  @IsInt()
  @Min(SALARY_MIN)
  salaryMax?: number;

  @IsOptional()
  @IsString()
  @MaxLength(CURRENCY_MAX_LENGTH)
  salaryCurrency?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(URL_MAX_LENGTH)
  url?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  appliedAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  nextActionDate?: Date;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(COMPANY_NAME_MAX_LENGTH)
  companyName?: string;
}
