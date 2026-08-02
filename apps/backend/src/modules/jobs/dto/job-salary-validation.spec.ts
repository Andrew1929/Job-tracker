// The DTO decorators need the metadata polyfill that `main.ts` loads at boot.
import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateJobDto } from './create-job.dto';
import { UpdateJobDto } from './update-job.dto';

/**
 * The job form enforces these two rules client-side. They are pinned here so a
 * direct API call cannot store a salary range or currency code the UI would
 * refuse to produce.
 */
async function failingProperties(
  dto: CreateJobDto | UpdateJobDto,
): Promise<string[]> {
  const errors = await validate(dto);
  return errors.map((error) => error.property);
}

describe('job salary validation', () => {
  it('rejects a maximum salary below the minimum', async () => {
    const dto = plainToInstance(CreateJobDto, {
      title: 'Backend engineer',
      salaryMin: 9000,
      salaryMax: 5000,
    });

    await expect(failingProperties(dto)).resolves.toContain('salaryMax');
  });

  it('accepts an equal minimum and maximum', async () => {
    const dto = plainToInstance(CreateJobDto, {
      title: 'Backend engineer',
      salaryMin: 9000,
      salaryMax: 9000,
    });

    await expect(failingProperties(dto)).resolves.toEqual([]);
  });

  it('ignores the comparison when only one bound is sent', async () => {
    const dto = plainToInstance(UpdateJobDto, { salaryMax: 5000 });

    await expect(failingProperties(dto)).resolves.toEqual([]);
  });

  it('rejects a currency code that is not three letters', async () => {
    const dto = plainToInstance(CreateJobDto, {
      title: 'Backend engineer',
      salaryCurrency: 'US',
    });

    await expect(failingProperties(dto)).resolves.toContain('salaryCurrency');
  });

  it('accepts a three-letter currency code', async () => {
    const dto = plainToInstance(CreateJobDto, {
      title: 'Backend engineer',
      salaryCurrency: 'USD',
    });

    await expect(failingProperties(dto)).resolves.toEqual([]);
  });
});
