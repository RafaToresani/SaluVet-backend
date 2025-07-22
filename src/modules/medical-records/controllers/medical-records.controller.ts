import { Body, Controller, Delete, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MedicalRecordsService } from '../services/medical-records.service';
import { MedicalRecordForCreationDto, VaccineForCreationDto } from '../dtos/medicalRecordForCreationDto.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { EUserRole } from 'generated/prisma';
import { MedicalRecordForUpdateDto } from '../dtos/medicalRecordForUpdateDto.dto';
import { VaccineForUpdateDto } from '../dtos/vaccineForUpdateDto.dto';

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

  @Patch()
  @ApiOperation({ summary: 'Actualizar un historial médico' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.VETERINARIO)
  async updateMedicalRecord(@UserId() userId: string, @Body() medicalRecordForUpdateDto: MedicalRecordForUpdateDto) {
    return this.medicalRecordsService.updateMedicalRecord(userId, medicalRecordForUpdateDto);
  }

  @Post('vaccines')
  @ApiOperation({ summary: 'Crear una vacuna' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.VETERINARIO)
  async createVaccine(@UserId() userId: string, @Query('medicalRecordId') medicalRecordId: string, @Body() vaccineForCreationDto: VaccineForCreationDto) {
    return this.medicalRecordsService.createVaccine(userId, medicalRecordId, vaccineForCreationDto);
  }

  @Patch('vaccines')
  @ApiOperation({ summary: 'Actualizar una vacuna' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.VETERINARIO)
  async updateVaccine(@UserId() userId: string, @Body() vaccineForUpdateDto: VaccineForUpdateDto) {
    return this.medicalRecordsService.updateVaccine(userId, vaccineForUpdateDto);
  }

  @Delete('vaccines')
  @ApiOperation({ summary: 'Eliminar una vacuna' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.VETERINARIO)
  async deleteVaccine(@UserId() userId: string, @Query('vaccineId') vaccineId: string) {
    return this.medicalRecordsService.deleteVaccine(userId, vaccineId);
  }
}
