import { Module } from '@nestjs/common';
import { ClinicalServicesService } from './services/clinical-services.service';
import { ClinicalServicesController } from './controllers/clinical-services.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ClinicalServicesService, PrismaService, JwtAuthGuard, RolesGuard, JwtService, ConfigService ],
  controllers: [ClinicalServicesController],
  exports: [ClinicalServicesService],
})
export class ClinicalServicesModule {}
