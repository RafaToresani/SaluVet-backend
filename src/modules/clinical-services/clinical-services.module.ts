import { Module } from '@nestjs/common';
import { ClinicalServicesService } from './services/clinical-services.service';
import { ClinicalServicesController } from './controllers/clinical-services.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ClinicalServicesService, PrismaService, JwtService, ConfigService ],
  controllers: [ClinicalServicesController],
  exports: [ClinicalServicesService],
})
export class ClinicalServicesModule {}
