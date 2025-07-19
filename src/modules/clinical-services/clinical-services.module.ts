import { Module } from '@nestjs/common';
import { ClinicalServicesService } from './services/clinical-services.service';
import { ClinicalServicesController } from './controllers/clinical-services.controller';

@Module({
  providers: [ClinicalServicesService],
  controllers: [ClinicalServicesController]
})
export class ClinicalServicesModule {}
