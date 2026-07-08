import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { CreateJobDto } from '../dto/create-job.dto';
import {
  JobResponseDto,
  PaginatedJobsResponseDto,
} from '../dto/job-response.dto';
import { QueryJobsDto } from '../dto/query-jobs.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { JobsService } from '../services/jobs.service';

@Controller('jobs')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createJobDto: CreateJobDto,
  ): Promise<JobResponseDto> {
    const job = await this.jobsService.create(user.id, createJobDto);
    return JobResponseDto.fromEntity(job);
  }

  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryJobsDto,
  ): Promise<PaginatedJobsResponseDto> {
    const { items, total } = await this.jobsService.findMany(user.id, query);
    return PaginatedJobsResponseDto.create(items, {
      page: query.page,
      limit: query.limit,
      total,
    });
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<JobResponseDto> {
    const job = await this.jobsService.findOne(user.id, id);
    return JobResponseDto.fromEntity(job);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateJobDto: UpdateJobDto,
  ): Promise<JobResponseDto> {
    const job = await this.jobsService.update(user.id, id, updateJobDto);
    return JobResponseDto.fromEntity(job);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.jobsService.remove(user.id, id);
  }
}
