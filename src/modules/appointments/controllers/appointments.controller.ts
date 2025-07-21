import { Body, Controller, Post } from '@nestjs/common';
import { AppointmentsService } from '../services/appointments.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppointmentForCreationDto } from '../dtos/appointmentForCreationDto.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { EUserRole } from 'generated/prisma';
import { Roles } from 'src/common/decorators/role.decorator';
import { UseGuards } from '@nestjs/common';

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
  async createAppointment(@Body() appointmentDto: AppointmentForCreationDto) {
    return this.appointmentsService.createAppointment(appointmentDto);
  }
}
