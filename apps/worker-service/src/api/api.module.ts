import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { JobsModule } from '../jobs/jobs.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [JobsModule, ServicesModule],
  controllers: [QueueController],
})
export class ApiModule {}