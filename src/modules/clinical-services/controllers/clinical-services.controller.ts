import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ClinicalServicesService } from '../services/clinical-services.service';
import { ClinicalServiceForCreationDto } from '../dto/clinicalServiceForCreationDto.dto';
import { ClinicalServiceResponse } from '../dto/clinical-service.response';
import { Roles } from 'src/common/decorators/role.decorator';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { EUserRole } from 'generated/prisma';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClinicalServiceForUpdateDto } from '../dto/clinicalServiceForUpdateDto.dto';

@Controller('clinical-services')
export class ClinicalServicesController {
  constructor(private readonly clinicalServicesService: ClinicalServicesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un servicio clínico' })
  @ApiResponse({ status: 201, description: 'Servicio clínico creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al crear el servicio clínico' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.SUPERADMIN)
  async createClinicalService(@Body() request: ClinicalServiceForCreationDto): Promise<ClinicalServiceResponse> {
    return this.clinicalServicesService.createClinicalService(request);
  }

  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los servicios clínicos' })
  @ApiResponse({ status: 200, description: 'Servicios clínicos obtenidos exitosamente' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  async getAllClinicalServices(): Promise<ClinicalServiceResponse[]> {
    return this.clinicalServicesService.getAllClinicalServices();
  }

  @Patch()
  @ApiOperation({ summary: 'Actualizar un servicio clínico' })
  @ApiResponse({ status: 200, description: 'Servicio clínico actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al actualizar el servicio clínico' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.SUPERADMIN)
  async updateClinicalService(@Body() request: ClinicalServiceForUpdateDto): Promise<ClinicalServiceResponse> {
    return this.clinicalServicesService.updateClinicalService(request);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un servicio clínico' })
  @ApiResponse({ status: 200, description: 'Servicio clínico eliminado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al eliminar el servicio clínico' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.SUPERADMIN)
  async deleteClinicalService(@Param('id') id: string): Promise<void> {
    return this.clinicalServicesService.deleteClinicalService(id);
  }
}
