import { Module } from '@nestjs/common';
import { ScheduleConfigService } from './services/schedule-config.service';
import { ScheduleConfigDayService } from './services/schedule-config-day.service';
import { ScheduleConfigController } from './controllers/schedule-config.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  providers: [ScheduleConfigService, ScheduleConfigDayService, PrismaService, ConfigService, JwtAuthGuard, RolesGuard],
  controllers: [ScheduleConfigController],
  exports: [ScheduleConfigService, ScheduleConfigDayService]
})
export class ScheduleModule {}
