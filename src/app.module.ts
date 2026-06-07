import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { RolesModule } from './roles/roles.module';
import { ApplicationsModule } from './applications/applications.module';
import { SlackModule } from './slack/slack.module';
import { QueueProcessorsModule } from './queue/queue-processors.module';
import { ReportsModule } from './reports/reports.module';
import { AuditModule } from './audit/audit.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    RolesModule,
    ApplicationsModule,
    SlackModule,
    QueueProcessorsModule,
    ReportsModule,
    AuditModule,
    GatewayModule,
  ],
})
export class AppModule {}
