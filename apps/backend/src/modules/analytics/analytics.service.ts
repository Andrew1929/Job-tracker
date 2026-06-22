import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

/**
 * Infrastructure placeholder for future dashboard metrics caching.
 */
@Injectable()
export class AnalyticsService {
  constructor(private readonly redisService: RedisService) {}

  buildMetricCacheKey(userId: string, metric: string): string {
    return this.redisService.getAnalyticsKey(userId, metric);
  }
}
