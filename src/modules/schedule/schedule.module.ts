import { Module } from '@nestjs/common';
import { ScheduleConfigService } from './services/schedule-config.service';
import { ScheduleConfigDayService } from './services/schedule-config-day.service';
import { ScheduleConfigController } from './controllers/schedule-config.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Module({
  providers: [ScheduleConfigService, ScheduleConfigDayService, PrismaService],
  controllers: [ScheduleConfigController],
  exports: [ScheduleConfigService, ScheduleConfigDayService]
})
export class ScheduleModule {}
