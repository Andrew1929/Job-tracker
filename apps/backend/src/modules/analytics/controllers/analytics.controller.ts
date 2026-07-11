import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { AnalyticsOverviewResponseDto } from '../dto/analytics-overview.dto';
import { AnalyticsService } from '../services/analytics.service';

@Controller('analytics')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AnalyticsOverviewResponseDto> {
    const overview = await this.analyticsService.getOverview(user.id);
    return AnalyticsOverviewResponseDto.fromDomain(overview);
  }
}
