import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CONFIG_KEY, RedisConfig } from '../../config/redis.config';
import { REDIS_CLIENT } from './redis.constants';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Redis => {
        const redisConfig = configService.get<RedisConfig>(REDIS_CONFIG_KEY);

        if (!redisConfig?.url) {
          throw new Error('REDIS_URL is not configured');
        }

        return new Redis(redisConfig.url, {
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        });
      },
    },
    RedisService,
  ],
  exports: [RedisService, REDIS_CLIENT],
})
export class RedisModule {}
