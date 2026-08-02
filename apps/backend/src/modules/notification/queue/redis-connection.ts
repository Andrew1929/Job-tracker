import type { RedisOptions } from 'ioredis';

/**
 * Maps the shared `REDIS_URL` to ioredis connection options for BullMQ. Options
 * are passed (rather than a shared client instance) so BullMQ can manage its own
 * blocking connections with the settings it requires.
 */
export function redisUrlToConnection(url: string): RedisOptions {
  const parsed = new URL(url);

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 6379,
    username: parsed.username || undefined,
    password: parsed.password || undefined,
    db:
      parsed.pathname.length > 1 ? Number(parsed.pathname.slice(1)) : undefined,
    ...(parsed.protocol === 'rediss:' ? { tls: {} } : {}),
  };
}
