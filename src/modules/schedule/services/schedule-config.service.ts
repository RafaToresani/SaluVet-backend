import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EUserRole, EWeekDay, ScheduleConfig, ScheduleConfigDay, User } from 'generated/prisma';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ScheduleConfigDayService } from './schedule-config-day.service';
import { ConfigService } from '@nestjs/config';
import { ScheduleConfigResponse } from '../dtos/schedule-config.response';
import { scheduleConfigToScheduleConfigResponse } from 'src/common/mappers/schedule.mappers';

@Injectable()
export class ScheduleConfigService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scheduleConfigDayService: ScheduleConfigDayService,
    private readonly configService: ConfigService
  ) {}

  async initializeScheduleConfig(vetId: string): Promise<ScheduleConfig> {
    return this.prisma.$transaction(async (tx) => {
      const scheduleConfig = await tx.scheduleConfig.create({
        data: { vetId },
      });
  
      const daysData = Object.values(EWeekDay).map((weekday) => ({
        scheduleId: scheduleConfig.id,
        weekday,
        startTime: this.configService.get('scheduleConfig.startTime')*60,
        endTime: this.configService.get('scheduleConfig.endTime')*60,
      }));
  
      await Promise.all(
        daysData.map((day) => tx.scheduleConfigDay.create({ data: day }))
      );
  
      const fullScheduleConfig = await tx.scheduleConfig.findUnique({
        where: { id: scheduleConfig.id },
        include: { days: true },
      });
  
      return fullScheduleConfig!;
    });
  }

  async getScheduleConfig(vetId: string): Promise<ScheduleConfigResponse> {
    const userFound = await this.userExists(vetId);
    if(!userFound) throw new NotFoundException('Usuario no encontrado');
    if(userFound.role !== EUserRole.VETERINARIO) throw new ForbiddenException('El usuario no es un veterinario');
    const scheduleConfig = await this.prisma.scheduleConfig.findUnique({where: {vetId}, include: {days: true}});
    if(!scheduleConfig) throw new NotFoundException('Configuración de agenda no encontrada');
    return scheduleConfigToScheduleConfigResponse(scheduleConfig as ScheduleConfig & {days: ScheduleConfigDay[]});
  }


  async userExists(vetId: string): Promise<User | null> {
    const userFound = await this.prisma.user.findUnique({where: {id: vetId}});
    return userFound;
  }
}
