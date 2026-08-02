import {
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
import { QueryNotificationsDto } from '../dto/query-notifications.dto';
import {
  PaginatedNotificationsResponseDto,
  UnreadCountResponseDto,
} from '../dto/notification-response.dto';
import { NotificationsService } from '../services/notifications.service';

@Controller('notifications')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryNotificationsDto,
  ): Promise<PaginatedNotificationsResponseDto> {
    const result = await this.notificationsService.findMany(user.id, query);
    return PaginatedNotificationsResponseDto.create(result, {
      page: query.page,
      limit: query.limit,
    });
  }

  @Get('unread-count')
  async unreadCount(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UnreadCountResponseDto> {
    const count = await this.notificationsService.countUnread(user.id);
    return UnreadCountResponseDto.create(count);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAsRead(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.notificationsService.markAsRead(user.id, id);
  }

  @Post('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllAsRead(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.notificationsService.markAllAsRead(user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.notificationsService.remove(user.id, id);
  }
}
