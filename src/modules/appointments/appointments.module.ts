import { Module } from '@nestjs/common';
import { AppointmentsService } from './services/appointments.service';
import { AppointmentsController } from './controllers/appointments.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ClinicalServicesModule } from '../clinical-services/clinical-services.module';
import { PetsModule } from '../pets/pets.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ClinicalServicesModule, PetsModule, ScheduleModule, UsersModule],
  providers: [AppointmentsService, PrismaService, JwtAuthGuard, RolesGuard],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
