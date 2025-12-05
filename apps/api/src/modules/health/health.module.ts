import { Module } from '@nestjs/common';
import { HealthRecordsService } from './health.service';
import { HealthRecordsController } from './health.controller';

@Module({
  controllers: [HealthRecordsController],
  providers: [HealthRecordsService],
  exports: [HealthRecordsService],
})
export class HealthModule {}


