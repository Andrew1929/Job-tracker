import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
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
import {
  InterviewResult,
  InterviewStatus,
  InterviewType,
  RemoteType,
} from '../../../../generated/prisma/client';

const LOCATION_MAX_LENGTH = 200;
const NOTES_MAX_LENGTH = 5000;
const INTERVIEWER_MAX_LENGTH = 200;
const MAX_INTERVIEWERS = 20;
const MAX_DURATION_MINUTES = 24 * 60;
const RATING_MIN = 1;
const RATING_MAX = 5;

export class CreateInterviewDto {
  @IsUUID()
  jobId!: string;

  @IsEnum(InterviewType)
  type!: InterviewType;

  @Type(() => Date)
  @IsDate()
  scheduledAt!: Date;

  @IsOptional()
  @IsEnum(InterviewStatus)
  status?: InterviewStatus;

  @IsOptional()
  @IsEnum(InterviewResult)
  result?: InterviewResult;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completedAt?: Date;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(MAX_DURATION_MINUTES)
  durationMinutes?: number;

  @IsOptional()
  @IsEnum(RemoteType)
  remoteType?: RemoteType;

  @IsOptional()
  @IsString()
  @MaxLength(LOCATION_MAX_LENGTH)
  location?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_INTERVIEWERS)
  @IsString({ each: true })
  @MaxLength(INTERVIEWER_MAX_LENGTH, { each: true })
  interviewers?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(NOTES_MAX_LENGTH)
  prepNotes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(NOTES_MAX_LENGTH)
  feedback?: string;

  @IsOptional()
  @IsInt()
  @Min(RATING_MIN)
  @Max(RATING_MAX)
  rating?: number;

  @IsOptional()
  @IsInt()
  @Min(RATING_MIN)
  @Max(RATING_MAX)
  difficulty?: number;
}
