import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';

interface CompanyReference {
  companyId?: string;
  companyName?: string;
}

@Injectable()
export class CompaniesService {
  /**
   * Resolves the company a job should be linked to.
   *
   * - `companyId`: validated to exist, returned as-is.
   * - `companyName`: found or created (case-insensitive, race-safe via the
   *   unique constraint on the normalized name).
   * - neither: returns `undefined` (caller leaves the relation untouched).
   *
   * Runs on the caller's transaction client so company resolution and job
   * persistence commit atomically.
   */
  async resolveCompanyId(
    tx: Prisma.TransactionClient,
    reference: CompanyReference,
  ): Promise<string | undefined> {
    const { companyId, companyName } = reference;

    if (companyId && companyName) {
      throw new BadRequestException(
        'Provide either companyId or companyName, not both',
      );
    }

    if (companyId) {
      return this.validateExistingCompany(tx, companyId);
    }

    if (companyName) {
      return this.findOrCreateByName(tx, companyName);
    }

    return undefined;
  }

  private async validateExistingCompany(
    tx: Prisma.TransactionClient,
    companyId: string,
  ): Promise<string> {
    const company = await tx.company.findUnique({
      where: { id: companyId },
      select: { id: true },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company.id;
  }

  private async findOrCreateByName(
    tx: Prisma.TransactionClient,
    rawName: string,
  ): Promise<string> {
    const name = this.normalizeName(rawName);

    if (!name) {
      throw new BadRequestException('companyName must not be empty');
    }

    const company = await tx.company.upsert({
      where: { name },
      create: { name },
      update: {},
      select: { id: true },
    });

    return company.id;
  }

  private normalizeName(name: string): string {
    return name.trim().replace(/\s+/g, ' ').toLowerCase();
  }
}
