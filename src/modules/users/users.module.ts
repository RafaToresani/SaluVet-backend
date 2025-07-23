import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ScheduleModule } from '../schedule/schedule.module';
import { ClinicalServicesModule } from '../clinical-services/clinical-services.module';

@Module({
  imports: [ScheduleModule, ClinicalServicesModule],
  controllers: [UsersController],
  providers: [PrismaService, UsersService],
  exports: [UsersService],
})  
export class UsersModule {}
