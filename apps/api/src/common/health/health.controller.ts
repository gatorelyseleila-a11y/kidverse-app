import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../modules/auth/decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Vérifier l\'état de l\'API' })
  @ApiResponse({ status: 200, description: 'API en bonne santé' })
  async check() {
    const startTime = Date.now();
    
    // Check database connection
    let dbStatus = 'healthy';
    let dbLatency = 0;
    try {
      const dbStart = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - dbStart;
    } catch (error) {
      dbStatus = 'unhealthy';
    }

    return {
      status: dbStatus === 'healthy' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: dbStatus,
          latency: `${dbLatency}ms`,
        },
      },
      responseTime: `${Date.now() - startTime}ms`,
    };
  }

  @Get('ready')
  @Public()
  @ApiOperation({ summary: 'Vérifier si l\'API est prête' })
  @ApiResponse({ status: 200, description: 'API prête' })
  @ApiResponse({ status: 503, description: 'API non prête' })
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ready' };
    } catch (error) {
      return { status: 'not ready', error: error.message };
    }
  }

  @Get('live')
  @Public()
  @ApiOperation({ summary: 'Vérifier si l\'API est vivante' })
  @ApiResponse({ status: 200, description: 'API vivante' })
  live() {
    return { status: 'alive' };
  }
}


