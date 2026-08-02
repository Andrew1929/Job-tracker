import { config as loadEnvFile } from 'dotenv';

/** BullMQ requires a Redis server of at least this version to operate. */
export const MIN_REDIS_VERSION = '5.0.0';

export const NOTIFICATION_QUEUE_ENABLED_ENV = 'NOTIFICATION_QUEUE_ENABLED';

let envEnsured = false;

/**
 * Whether the BullMQ-backed notification queue capability is enabled.
 *
 * Resolved from `NOTIFICATION_QUEUE_ENABLED` and defaults to `false`, so an
 * environment whose Redis does not meet BullMQ's minimum version never
 * initializes the queue. `.env` is loaded defensively (dotenv is already the
 * project's env loader) so the flag is read consistently regardless of module
 * evaluation order relative to `ConfigModule`.
 */
export function isNotificationQueueEnabled(): boolean {
  if (!envEnsured) {
    loadEnvFile();
    envEnsured = true;
  }

  return process.env[NOTIFICATION_QUEUE_ENABLED_ENV] === 'true';
}
