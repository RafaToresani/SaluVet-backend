import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ScheduleModule } from '../schedule/schedule.module';
import { ScheduleConfigService } from '../schedule/services/schedule-config.service';
import { ScheduleConfigDayService } from '../schedule/services/schedule-config-day.service';

@Module({
  imports: [ScheduleModule],
  controllers: [UsersController],
  providers: [PrismaService, UsersService, JwtAuthGuard, RolesGuard, ScheduleConfigService, ScheduleConfigDayService],
  exports: [UsersService],
})
export class UsersModule {}
