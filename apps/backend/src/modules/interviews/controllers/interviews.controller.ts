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
import { CreateInterviewDto } from '../dto/create-interview.dto';
import {
  InterviewResponseDto,
  PaginatedInterviewsResponseDto,
} from '../dto/interview-response.dto';
import { QueryInterviewsDto } from '../dto/query-interviews.dto';
import { UpdateInterviewDto } from '../dto/update-interview.dto';
import { InterviewsService } from '../services/interviews.service';

@Controller('interviews')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateInterviewDto,
  ): Promise<InterviewResponseDto> {
    const interview = await this.interviewsService.create(user.id, dto);
    return InterviewResponseDto.fromEntity(interview);
  }

  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryInterviewsDto,
  ): Promise<PaginatedInterviewsResponseDto> {
    const result = await this.interviewsService.findMany(user.id, query);
    return PaginatedInterviewsResponseDto.create(result, {
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<InterviewResponseDto> {
    const interview = await this.interviewsService.findOne(user.id, id);
    return InterviewResponseDto.fromEntity(interview);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateInterviewDto,
  ): Promise<InterviewResponseDto> {
    const interview = await this.interviewsService.update(user.id, id, dto);
    return InterviewResponseDto.fromEntity(interview);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.interviewsService.remove(user.id, id);
  }
}
