import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MedicalRecordsService } from '../services/medical-records.service';
import { MedicalRecordForCreationDto } from '../dtos/medicalRecordForCreationDto.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { EUserRole } from 'generated/prisma';

@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un historial médico' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.VETERINARIO)
  async createMedicalRecord(@UserId() userId: string, @Body() medicalRecordForCreationDto: MedicalRecordForCreationDto) {
    return this.medicalRecordsService.createMedicalRecord(userId, medicalRecordForCreationDto);
  }
}
