import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HealthRecordsService } from './health.service';

@ApiTags('health')
@Controller('health-records')
@ApiBearerAuth('JWT-auth')
export class HealthRecordsController {
  constructor(private readonly healthService: HealthRecordsService) {}

  // TODO: Implement health endpoints
}


