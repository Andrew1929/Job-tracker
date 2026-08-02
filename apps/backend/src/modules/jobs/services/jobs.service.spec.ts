import { BadRequestException } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import { AnalyticsService } from '../../analytics/services/analytics.service';
import { NotificationSchedulerService } from '../../notification/services/notification-scheduler.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JobSortField, QueryJobsDto, SortOrder } from '../dto/query-jobs.dto';
import { CompaniesService } from './companies.service';
import { JobsService } from './jobs.service';

const USER_ID = 'user-1';

describe('JobsService.findMany', () => {
  let service: JobsService;
  let prisma: {
    $transaction: jest.Mock;
    job: { findMany: jest.Mock; count: jest.Mock };
  };

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn().mockResolvedValue([[], 0]),
      job: { findMany: jest.fn(), count: jest.fn() },
    };

    service = new JobsService(
      prisma as unknown as PrismaService,
      {} as CompaniesService,
      {} as AnalyticsService,
      {} as NotificationSchedulerService,
    );
  });

  /** Starts from the DTO's own defaults so the test mirrors a real request. */
  function buildQuery(overrides: Partial<QueryJobsDto> = {}): QueryJobsDto {
    return Object.assign(new QueryJobsDto(), overrides);
  }

  function findManyArgs(): Prisma.JobFindManyArgs {
    const [args] = prisma.job.findMany.mock.calls[0] as [
      Prisma.JobFindManyArgs,
    ];
    return args;
  }

  function capturedWhere(): Prisma.JobWhereInput {
    return findManyArgs().where ?? {};
  }

  it('scopes every query to the authenticated user', async () => {
    await service.findMany(USER_ID, buildQuery());

    expect(capturedWhere().userId).toBe(USER_ID);
  });

  it('filters on an inclusive nextActionDate range', async () => {
    const nextActionFrom = new Date('2026-07-27T00:00:00.000Z');
    const nextActionTo = new Date('2026-09-06T00:00:00.000Z');

    await service.findMany(
      USER_ID,
      buildQuery({ nextActionFrom, nextActionTo }),
    );

    expect(capturedWhere()).toMatchObject({
      userId: USER_ID,
      nextActionDate: { gte: nextActionFrom, lte: nextActionTo },
    });
  });

  it('supports an open-ended lower bound', async () => {
    const nextActionFrom = new Date('2026-07-27T00:00:00.000Z');

    await service.findMany(USER_ID, buildQuery({ nextActionFrom }));

    expect(capturedWhere().nextActionDate).toEqual({ gte: nextActionFrom });
  });

  it('omits the date filter entirely when no bound is given', async () => {
    await service.findMany(USER_ID, buildQuery());

    expect(capturedWhere().nextActionDate).toBeUndefined();
  });

  it('rejects an inverted range', async () => {
    const query = buildQuery({
      nextActionFrom: new Date('2026-09-06T00:00:00.000Z'),
      nextActionTo: new Date('2026-07-27T00:00:00.000Z'),
    });

    await expect(service.findMany(USER_ID, query)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.job.findMany).not.toHaveBeenCalled();
  });

  it('accepts a single-day range where both bounds are equal', async () => {
    const day = new Date('2026-07-31T00:00:00.000Z');

    await expect(
      service.findMany(
        USER_ID,
        buildQuery({ nextActionFrom: day, nextActionTo: day }),
      ),
    ).resolves.toBeDefined();
  });

  it('can sort by the scheduled action date', async () => {
    await service.findMany(
      USER_ID,
      buildQuery({
        sortBy: JobSortField.NEXT_ACTION_DATE,
        sortOrder: SortOrder.ASC,
      }),
    );

    expect(findManyArgs().orderBy).toEqual({ nextActionDate: 'asc' });
  });
});
