import { Module } from '@nestjs/common';
import { ScheduleConfigService } from './services/schedule-config.service';
import { ScheduleConfigController } from './controllers/schedule-config.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ScheduleConfigService, PrismaService, ConfigService],
  controllers: [ScheduleConfigController],
  exports: [ScheduleConfigService]
})
export class ScheduleModule {}
