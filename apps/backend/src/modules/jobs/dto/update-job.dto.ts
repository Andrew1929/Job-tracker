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
  Matches,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import {
  EmploymentType,
  JobPriority,
  JobSource,
  JobStatus,
  RemoteType,
} from '../../../../generated/prisma/client';
import { IsNotLessThanProperty } from '../../../common/validators/is-not-less-than.validator';

const TITLE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 5000;
const URL_MAX_LENGTH = 2048;
const COMPANY_NAME_MAX_LENGTH = 200;
const LOCATION_MAX_LENGTH = 200;
const CURRENCY_CODE_PATTERN = /^[A-Za-z]{3}$/;
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
  @IsNotLessThanProperty('salaryMin')
  salaryMax?: number;

  @IsOptional()
  @IsString()
  @Matches(CURRENCY_CODE_PATTERN, {
    message: 'salaryCurrency must be a 3-letter currency code',
  })
  salaryCurrency?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(URL_MAX_LENGTH)
  url?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  appliedAt?: Date;

  // Explicit null clears the scheduled next action and cancels its reminder.
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @Type(() => Date)
  @IsDate()
  nextActionDate?: Date | null;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(COMPANY_NAME_MAX_LENGTH)
  companyName?: string;
}
