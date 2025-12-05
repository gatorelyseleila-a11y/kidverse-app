import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class HealthRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: Implement health records management
}


