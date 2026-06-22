import { registerAs } from '@nestjs/config';

export const REDIS_CONFIG_KEY = 'redis';

export interface RedisConfig {
  url: string;
}

export default registerAs(
  REDIS_CONFIG_KEY,
  (): RedisConfig => ({
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  }),
);
