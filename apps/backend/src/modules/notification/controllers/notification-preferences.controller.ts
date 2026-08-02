import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { NotificationPreferencesResponseDto } from '../dto/notification-preferences-response.dto';
import { UpdateNotificationPreferencesDto } from '../dto/update-notification-preferences.dto';
import { NotificationPreferencesService } from '../services/notification-preferences.service';

@Controller('notification-preferences')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class NotificationPreferencesController {
  constructor(
    private readonly preferencesService: NotificationPreferencesService,
  ) {}

  @Get()
  async get(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<NotificationPreferencesResponseDto> {
    const preferences = await this.preferencesService.getOrCreate(user.id);
    return NotificationPreferencesResponseDto.fromEntity(preferences);
  }

  @Patch()
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateNotificationPreferencesDto,
  ): Promise<NotificationPreferencesResponseDto> {
    const preferences = await this.preferencesService.update(user.id, dto);
    return NotificationPreferencesResponseDto.fromEntity(preferences);
  }
}
