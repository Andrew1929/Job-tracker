import { Module } from '@nestjs/common';
import { InterviewsController } from './controllers/interviews.controller';
import { InterviewsService } from './services/interviews.service';

@Module({
  controllers: [InterviewsController],
  providers: [InterviewsService],
})
export class InterviewsModule {}
