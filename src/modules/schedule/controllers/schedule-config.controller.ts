import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ScheduleConfigService } from '../services/schedule-config.service';
import { ScheduleConfigResponse } from '../dtos/schedule-config.response';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';

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
}
