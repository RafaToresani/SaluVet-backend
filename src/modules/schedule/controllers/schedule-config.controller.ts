import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { ScheduleConfigService } from '../services/schedule-config.service';
import { ScheduleConfigResponse } from '../dtos/schedule-config.response';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { ScheduleConfigForUpdateDto } from '../dtos/scheduleConfigForUpdateDto.dto';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { EUserRole } from 'generated/prisma';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('schedule-config')
export class ScheduleConfigController {
  constructor(private readonly scheduleConfigService: ScheduleConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener configuración de agenda' })
  @ApiResponse({ status: 200, description: 'Configuración de agenda obtenida correctamente', type: ScheduleConfigResponse })
  @ApiResponse({ status: 404, description: 'Configuración de agenda no encontrada' })
  @ApiQuery({ name: 'vetId', type: String, description: 'ID del veterinario' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  async getScheduleConfig(@Query('vetId') vetId: string): Promise<ScheduleConfigResponse> {
    return this.scheduleConfigService.getScheduleConfig(vetId);
  }

  @Get('my-schedule-config')
  @ApiOperation({ summary: 'Obtener configuración de agenda del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Configuración de agenda obtenida correctamente', type: ScheduleConfigResponse })
  @ApiResponse({ status: 404, description: 'Configuración de agenda no encontrada' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.VETERINARIO)
  async getMyScheduleConfig(@UserId() userId: string): Promise<ScheduleConfigResponse> {
    return this.scheduleConfigService.getScheduleConfig(userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Actualizar configuración de agenda' })
  @ApiResponse({ status: 200, description: 'Configuración de agenda actualizada correctamente', type: ScheduleConfigResponse })
  @ApiResponse({ status: 404, description: 'Configuración de agenda no encontrada' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.VETERINARIO)
  async updateScheduleConfig(@UserId() userId: string, @Body() request: ScheduleConfigForUpdateDto): Promise<ScheduleConfigResponse> {
    return this.scheduleConfigService.updateScheduleConfig(userId, request);
  }
}
