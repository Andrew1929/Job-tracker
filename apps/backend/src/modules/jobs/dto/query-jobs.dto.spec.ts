// The DTO decorators need the metadata polyfill that `main.ts` loads at boot.
import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { QueryJobsDto } from './query-jobs.dto';

/**
 * Query parameters always arrive as strings, and the global ValidationPipe runs
 * with `enableImplicitConversion`. These tests pin the transform contract the
 * calendar relies on.
 */
function transform(query: Record<string, string>): QueryJobsDto {
  return plainToInstance(QueryJobsDto, query, {
    enableImplicitConversion: true,
  });
}

describe('QueryJobsDto next action range', () => {
  it('converts ISO query strings into Date instances', async () => {
    const dto = transform({
      nextActionFrom: '2026-07-27T00:00:00.000Z',
      nextActionTo: '2026-09-06T00:00:00.000Z',
    });

    expect(dto.nextActionFrom).toBeInstanceOf(Date);
    expect(dto.nextActionFrom?.toISOString()).toBe('2026-07-27T00:00:00.000Z');
    expect(dto.nextActionTo?.toISOString()).toBe('2026-09-06T00:00:00.000Z');
    await expect(validate(dto)).resolves.toEqual([]);
  });

  it('accepts a date-only string', async () => {
    const dto = transform({ nextActionFrom: '2026-07-27' });

    expect(dto.nextActionFrom?.toISOString()).toBe('2026-07-27T00:00:00.000Z');
    await expect(validate(dto)).resolves.toEqual([]);
  });

  it('rejects a value that is not a date', async () => {
    const errors = await validate(transform({ nextActionFrom: 'yesterday' }));

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('nextActionFrom');
  });

  it('leaves the bounds undefined when they are not supplied', async () => {
    const dto = transform({});

    expect(dto.nextActionFrom).toBeUndefined();
    expect(dto.nextActionTo).toBeUndefined();
    await expect(validate(dto)).resolves.toEqual([]);
  });

  it('allows sorting by nextActionDate', async () => {
    const dto = transform({ sortBy: 'nextActionDate', sortOrder: 'asc' });

    await expect(validate(dto)).resolves.toEqual([]);
  });
});
