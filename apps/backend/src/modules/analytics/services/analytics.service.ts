import { Injectable } from '@nestjs/common';
import { JobActivityType } from '../../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { buildAnalyticsOverview } from '../aggregation/analytics.aggregator';
import {
  ANALYTICS_CACHE_METRIC,
  ANALYTICS_CACHE_TTL_SECONDS,
} from '../constants/analytics.constants';
import {
  ANALYTICS_ACTIVITY_SELECT,
  ANALYTICS_JOB_SELECT,
  AnalyticsOverview,
} from '../types/analytics.types';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getOverview(userId: string): Promise<AnalyticsOverview> {
    const cacheKey = this.buildCacheKey(userId);
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as AnalyticsOverview;
    }

    const overview = await this.computeOverview(userId);
    await this.redis.set(
      cacheKey,
      JSON.stringify(overview),
      ANALYTICS_CACHE_TTL_SECONDS,
    );

    return overview;
  }

  async invalidateCache(userId: string): Promise<void> {
    await this.redis.del(this.buildCacheKey(userId));
  }

  private async computeOverview(userId: string): Promise<AnalyticsOverview> {
    const [jobs, activities] = await Promise.all([
      this.prisma.job.findMany({
        where: { userId },
        select: ANALYTICS_JOB_SELECT,
      }),
      this.prisma.jobActivity.findMany({
        where: { type: JobActivityType.STATUS_CHANGE, job: { userId } },
        select: ANALYTICS_ACTIVITY_SELECT,
      }),
    ]);

    return buildAnalyticsOverview({ jobs, activities, now: new Date() });
  }

  private buildCacheKey(userId: string): string {
    return this.redis.getAnalyticsKey(userId, ANALYTICS_CACHE_METRIC);
  }
}
