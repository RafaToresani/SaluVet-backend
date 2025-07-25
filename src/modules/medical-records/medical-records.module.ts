import { Module } from '@nestjs/common';
import { MedicalRecordsController } from './controllers/medical-records.controller';
import { MedicalRecordsService } from './services/medical-records.service';
import { UsersModule } from '../users/users.module';
import { PetsModule } from '../pets/pets.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { PrismaService } from 'src/config/prisma/prisma.service';


@Module({
  imports: [UsersModule, PetsModule, AppointmentsModule],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService, PrismaService],
  exports: [MedicalRecordsService],
})
export class MedicalRecordsModule {}
