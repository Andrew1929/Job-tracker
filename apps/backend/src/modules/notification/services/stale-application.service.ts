import { Injectable, Logger } from '@nestjs/common';
import {
  JobStatus,
  NotificationEntityType,
  NotificationPriority,
  NotificationType,
} from '../../../../generated/prisma/client';
import {
  getLocalHour,
  resolveTimeZone,
} from '../../../common/utils/timezone.util';
import { PrismaService } from '../../prisma/prisma.service';
import {
  DAYS_TO_MS,
  NOTIFICATION_DEFAULTS,
  SCAN_BATCH_SIZE,
  STALE_SCAN_LOCAL_HOUR,
} from '../constants/notification.constants';
import { buildStaleApplicationContent } from '../content/notification-content.builder';
import { dedupeKey } from '../dedupe/notification-keys';
import { NotificationDeliveryService } from './notification-delivery.service';

interface EffectiveStalePrefs {
  enabled: boolean;
  timezone: string;
  thresholdDays: number;
}

interface StaleCandidate {
  id: string;
  title: string;
  createdAt: Date;
  appliedAt: Date | null;
  companyName: string | null;
}

/**
 * Detects applications that have gone quiet. Runs hourly and only acts for users
 * whose local time matches the delivery hour, so the scan is spread across the
 * day and each user is considered once per day. Deduplication is keyed on the
 * last meaningful activity, so a user is notified at most once per stale period
 * and only again after fresh activity restarts the clock.
 */
@Injectable()
export class StaleApplicationService {
  private readonly logger = new Logger(StaleApplicationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly delivery: NotificationDeliveryService,
  ) {}

  async scan(now: Date = new Date()): Promise<void> {
    const userIds = await this.findUsersWithActiveApplications();
    if (userIds.length === 0) {
      return;
    }

    const prefsByUser = await this.loadPreferences(userIds);
    let created = 0;

    for (const userId of userIds) {
      const prefs = prefsByUser.get(userId) ?? this.defaultPrefs();

      if (
        !prefs.enabled ||
        getLocalHour(now, prefs.timezone) !== STALE_SCAN_LOCAL_HOUR
      ) {
        continue;
      }

      created += await this.scanUser(userId, prefs, now);
    }

    this.logger.log(`stale.scan_completed created=${created}`);
  }

  private async scanUser(
    userId: string,
    prefs: EffectiveStalePrefs,
    now: Date,
  ): Promise<number> {
    const threshold = new Date(
      now.getTime() - prefs.thresholdDays * DAYS_TO_MS,
    );
    let created = 0;
    let skip = 0;

    for (;;) {
      const jobs = await this.prisma.job.findMany({
        where: {
          userId,
          status: JobStatus.APPLIED,
          createdAt: { lte: threshold },
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          appliedAt: true,
          company: { select: { name: true } },
        },
        orderBy: { id: 'asc' },
        skip,
        take: SCAN_BATCH_SIZE,
      });

      if (jobs.length === 0) {
        break;
      }

      const candidates: StaleCandidate[] = jobs.map((job) => ({
        id: job.id,
        title: job.title,
        createdAt: job.createdAt,
        appliedAt: job.appliedAt,
        companyName: job.company?.name ?? null,
      }));

      created += await this.processBatch(userId, candidates, prefs, threshold);

      if (jobs.length < SCAN_BATCH_SIZE) {
        break;
      }
      skip += SCAN_BATCH_SIZE;
    }

    return created;
  }

  private async processBatch(
    userId: string,
    candidates: StaleCandidate[],
    prefs: EffectiveStalePrefs,
    threshold: Date,
  ): Promise<number> {
    const ids = candidates.map((candidate) => candidate.id);
    const lastActivityByJob = await this.lastActivityByJob(ids);
    let created = 0;

    for (const candidate of candidates) {
      const lastActivityAt = this.resolveLastActivity(
        candidate,
        lastActivityByJob.get(candidate.id),
      );

      if (lastActivityAt.getTime() > threshold.getTime()) {
        continue;
      }

      const delivered = await this.delivery.deliver({
        userId,
        type: NotificationType.APPLICATION_STALE,
        priority: NotificationPriority.NORMAL,
        ...buildStaleApplicationContent(candidate, prefs.thresholdDays),
        relatedEntityType: NotificationEntityType.JOB,
        relatedEntityId: candidate.id,
        dedupeKey: dedupeKey.staleApplication(candidate.id, lastActivityAt),
      });

      if (delivered) {
        created += 1;
      } else {
        this.logger.log(`stale.skipped reason=duplicate jobId=${candidate.id}`);
      }
    }

    return created;
  }

  /** Latest meaningful activity timestamp per job, without N+1 queries. */
  private async lastActivityByJob(
    jobIds: string[],
  ): Promise<Map<string, Date>> {
    const [activities, notes, interviews] = await Promise.all([
      this.prisma.jobActivity.groupBy({
        by: ['jobId'],
        where: { jobId: { in: jobIds } },
        _max: { createdAt: true },
      }),
      this.prisma.note.groupBy({
        by: ['jobId'],
        where: { jobId: { in: jobIds } },
        _max: { createdAt: true },
      }),
      this.prisma.interview.groupBy({
        by: ['jobId'],
        where: { jobId: { in: jobIds } },
        _max: { createdAt: true },
      }),
    ]);

    const latest = new Map<string, Date>();
    const merge = (jobId: string, date: Date | null): void => {
      if (!date) {
        return;
      }
      const current = latest.get(jobId);
      if (!current || date.getTime() > current.getTime()) {
        latest.set(jobId, date);
      }
    };

    for (const row of activities) merge(row.jobId, row._max.createdAt);
    for (const row of notes) merge(row.jobId, row._max.createdAt);
    for (const row of interviews) merge(row.jobId, row._max.createdAt);

    return latest;
  }

  private resolveLastActivity(
    candidate: StaleCandidate,
    relatedActivity: Date | undefined,
  ): Date {
    return [
      candidate.createdAt,
      candidate.appliedAt,
      relatedActivity,
    ].reduce<Date>((latest, value) => {
      if (value && value.getTime() > latest.getTime()) {
        return value;
      }
      return latest;
    }, candidate.createdAt);
  }

  private async findUsersWithActiveApplications(): Promise<string[]> {
    const rows = await this.prisma.job.groupBy({
      by: ['userId'],
      where: { status: JobStatus.APPLIED },
    });
    return rows.map((row) => row.userId);
  }

  private async loadPreferences(
    userIds: string[],
  ): Promise<Map<string, EffectiveStalePrefs>> {
    const rows = await this.prisma.notificationPreferences.findMany({
      where: { userId: { in: userIds } },
      select: {
        userId: true,
        inAppEnabled: true,
        staleApplicationRemindersEnabled: true,
        timezone: true,
        staleApplicationThresholdDays: true,
      },
    });

    const map = new Map<string, EffectiveStalePrefs>();
    for (const row of rows) {
      map.set(row.userId, {
        enabled: row.inAppEnabled && row.staleApplicationRemindersEnabled,
        timezone: resolveTimeZone(row.timezone),
        thresholdDays: row.staleApplicationThresholdDays,
      });
    }
    return map;
  }

  private defaultPrefs(): EffectiveStalePrefs {
    return {
      enabled: true,
      timezone: NOTIFICATION_DEFAULTS.TIMEZONE,
      thresholdDays: NOTIFICATION_DEFAULTS.STALE_THRESHOLD_DAYS,
    };
  }
}
