import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Configuration
import configuration from './config/configuration';

// Common modules
import { PrismaModule } from './common/prisma/prisma.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CentersModule } from './modules/centers/centers.module';
import { ChildrenModule } from './modules/children/children.module';
import { StaffModule } from './modules/staff/staff.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { HealthModule } from './modules/health/health.module';
import { PedagogyModule } from './modules/pedagogy/pedagogy.module';
import { FinanceModule } from './modules/finance/finance.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';

// Guards
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';

// Health check
import { HealthCheckModule } from './common/health/health.module';

@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    // Base de données
    PrismaModule,

    // Health check
    HealthCheckModule,

    // Authentification & Utilisateurs
    AuthModule,
    UsersModule,

    // Modules métier
    CentersModule,
    ChildrenModule,
    StaffModule,
    AttendanceModule,
    HealthModule,
    PedagogyModule,
    FinanceModule,

    // Services avancés
    BlockchainModule,
    NotificationsModule,
    ReportsModule,
  ],
  providers: [
    // Global JWT Guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global Roles Guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Global Logging Interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}


