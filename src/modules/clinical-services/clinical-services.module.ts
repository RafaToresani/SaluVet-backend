import { Module } from '@nestjs/common';
import { ClinicalServicesService } from './services/clinical-services.service';
import { ClinicalServicesController } from './controllers/clinical-services.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Module({
  providers: [ClinicalServicesService, PrismaService],
  controllers: [ClinicalServicesController],
  exports: [ClinicalServicesService],
})
export class ClinicalServicesModule {}
