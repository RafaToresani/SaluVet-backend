import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AppointmentsService } from '../services/appointments.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppointmentForCreationDto } from '../dtos/appointmentForCreationDto.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { EAppointmentStatus, EUserRole } from 'generated/prisma';
import { Roles } from 'src/common/decorators/role.decorator';
import { UseGuards } from '@nestjs/common';
import { RescheduleAppointmentDto } from '../dtos/rescheduleAppointmentDto.dto';
import { AppointmentResponse } from '../dtos/appointment.response';
import { UserId } from 'src/common/decorators/user-id.decorator';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una cita' })
  @ApiResponse({ status: 201, description: 'Cita creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al crear la cita' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.RECEPCIONISTA, EUserRole.SUPERADMIN)
  createAppointment(@Body() appointmentDto: AppointmentForCreationDto) {
    return this.appointmentsService.createAppointment(appointmentDto);
  }

  @Get('by-date')
  @ApiOperation({ summary: 'Buscar citas por fecha' })
  @ApiResponse({ status: 200, description: 'Citas encontradas exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al buscar las citas' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.RECEPCIONISTA, EUserRole.SUPERADMIN)
  getAppointmentsByDate(@Query('date') date: Date) {
    return this.appointmentsService.getAppointmentsByDate(date);
  }

  @Get('by-pet/:petId')
  @ApiOperation({ summary: 'Buscar citas por ID de mascota' })
  @ApiResponse({ status: 200, description: 'Citas encontradas exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al buscar las citas' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.RECEPCIONISTA, EUserRole.SUPERADMIN)
  getAppointmentsByPetId(@Param('petId') petId: string): Promise<AppointmentResponse[]> {
    return this.appointmentsService.getAppointmentsByPetId(petId);
  }

  @Get('by-vet/my')
  @ApiOperation({ summary: 'Buscar citas del veterinario del día' })
  @ApiResponse({ status: 200, description: 'Citas encontradas exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al buscar las citas' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.VETERINARIO)
  getAppointmentsByVetId(@UserId() vetId: string, @Query('date') date: Date): Promise<AppointmentResponse[]> {
    return this.appointmentsService.getAppointmentsByVetId(vetId, date);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Reprogramar una cita' })
  @ApiResponse({ status: 200, description: 'Cita reprogramada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al reprogramar la cita' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.RECEPCIONISTA, EUserRole.SUPERADMIN)
  rescheduleAppointment(@Param('id') id: string, @Body() rescheduleDto: RescheduleAppointmentDto): Promise<AppointmentResponse> {
    return this.appointmentsService.rescheduleAppointment(id, rescheduleDto);
  }

  @Patch('update-status/:id')
  @ApiOperation({ summary: 'Actualizar el estado de una cita' })
  @ApiResponse({ status: 200, description: 'Cita actualizada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al actualizar el estado de la cita' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.RECEPCIONISTA, EUserRole.SUPERADMIN, EUserRole.VETERINARIO)
  updateAppointmentStatus(@Param('id') id: string, @Query('status') status: EAppointmentStatus): Promise<AppointmentResponse> {
    return this.appointmentsService.updateAppointmentStatus(id, status);
  }
}
