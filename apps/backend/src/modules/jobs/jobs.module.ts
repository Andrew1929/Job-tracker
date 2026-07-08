import { Module } from '@nestjs/common';
import { JobsController } from './controllers/jobs.controller';
import { CompaniesService } from './services/companies.service';
import { JobsService } from './services/jobs.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService, CompaniesService],
})
export class JobsModule {}
