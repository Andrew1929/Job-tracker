import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import authConfig from './auth.config';
import redisConfig from './redis.config';
import { validate } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, redisConfig],
      validate,
    }),
  ],
})
export class AppConfigModule {}
