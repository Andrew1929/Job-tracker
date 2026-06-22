import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

/**
 * Infrastructure placeholder for future notification delivery and caching.
 * Auth and other modules can depend on RedisService directly; this module
 * provides a dedicated extension point without coupling to auth.
 */
@Injectable()
export class NotificationService {
  constructor(private readonly redisService: RedisService) {}

  buildNotificationCacheKey(userId: string, notificationId: string): string {
    return this.redisService.getNotificationKey(userId, notificationId);
  }
}
