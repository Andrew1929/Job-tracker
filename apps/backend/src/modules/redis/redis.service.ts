import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_KEY_PREFIX } from '../../common/constants/redis-keys.constants';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }

  buildKey(prefix: string, ...parts: string[]): string {
    return [prefix, ...parts].join(':');
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
      return;
    }

    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(...keys: string[]): Promise<void> {
    if (keys.length === 0) {
      return;
    }

    await this.client.del(...keys);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async delByPattern(pattern: string): Promise<number> {
    let cursor = '0';
    let deletedCount = 0;

    do {
      const [nextCursor, keys] = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );

      cursor = nextCursor;

      if (keys.length > 0) {
        deletedCount += await this.client.del(...keys);
      }
    } while (cursor !== '0');

    return deletedCount;
  }

  getAuthRefreshKey(userId: string, sessionId: string): string {
    return this.buildKey(REDIS_KEY_PREFIX.AUTH_REFRESH, userId, sessionId);
  }

  getNotificationKey(userId: string, notificationId: string): string {
    return this.buildKey(REDIS_KEY_PREFIX.NOTIFICATION, userId, notificationId);
  }

  getAnalyticsKey(userId: string, metric: string): string {
    return this.buildKey(REDIS_KEY_PREFIX.ANALYTICS, userId, metric);
  }
}
