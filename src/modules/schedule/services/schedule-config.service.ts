import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  EUserRole,
  EWeekDay,
  ScheduleConfig,
  ScheduleConfigDay,
  User,
} from 'generated/prisma';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ScheduleConfigDayService } from './schedule-config-day.service';
import { ConfigService } from '@nestjs/config';
import { ScheduleConfigResponse } from '../dtos/schedule-config.response';
import { scheduleConfigToScheduleConfigResponse } from 'src/common/mappers/schedule.mappers';
import {
  ScheduleConfigDayForUpdateDto,
  ScheduleConfigForUpdateDto,
} from '../dtos/scheduleConfigForUpdateDto.dto';

@Injectable()
export class ScheduleConfigService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scheduleConfigDayService: ScheduleConfigDayService,
    private readonly configService: ConfigService,
  ) {}

  async initializeScheduleConfig(vetId: string): Promise<ScheduleConfig> {
    return this.prisma.$transaction(async (tx) => {
      const scheduleConfig = await tx.scheduleConfig.create({
        data: { vetId },
      });

      const daysData = Object.values(EWeekDay).map((weekday) => ({
        scheduleId: scheduleConfig.id,
        weekday,
        startTime: this.configService.get('scheduleConfig.startTime') * 60,
        endTime: this.configService.get('scheduleConfig.endTime') * 60,
      }));

      await Promise.all(
        daysData.map((day) => tx.scheduleConfigDay.create({ data: day })),
      );

      const fullScheduleConfig = await tx.scheduleConfig.findUnique({
        where: { id: scheduleConfig.id },
        include: { days: true },
      });

      return fullScheduleConfig!;
    });
  }

  async updateScheduleConfig(
    vetId: string,
    request: ScheduleConfigForUpdateDto,
  ): Promise<ScheduleConfigResponse> {
    const userFound = await this.userExists(vetId);
    if (!userFound) throw new NotFoundException('Usuario no encontrado');
    if (userFound.role !== EUserRole.VETERINARIO)
      throw new ForbiddenException('El usuario no es un veterinario');
    const scheduleConfig = await this.prisma.scheduleConfig.findUnique({
      where: { vetId },
      include: { days: true },
    });
    if (!scheduleConfig)
      throw new NotFoundException('Configuración de agenda no encontrada');

    const daysToUpdate = request.days;

    const updateOperations: Promise<ScheduleConfigDay>[] = [];
  
    for (const dayToUpdate of daysToUpdate || []) {
      const dayFound = scheduleConfig.days.find(
        (day) => day.weekday === dayToUpdate.weekday,
      );
      if (!dayFound)
        throw new NotFoundException(`Día ${dayToUpdate.weekday} no encontrado`);
  
      this.validateDayUpdate(dayToUpdate, dayFound);
  
      const updateData: Partial<ScheduleConfigDay> = {};
  
      if (typeof dayToUpdate.isActive === 'boolean') {
        updateData.isActive = dayToUpdate.isActive;
      }
      if (typeof dayToUpdate.startTime === 'number') {
        updateData.startTime = dayToUpdate.startTime;
      }
      if (typeof dayToUpdate.endTime === 'number') {
        updateData.endTime = dayToUpdate.endTime;
      }
  
      updateOperations.push(
        this.prisma.scheduleConfigDay.update({
          where: { id: dayFound.id },
          data: updateData,
        }),
      );
    }
  
    await Promise.all(updateOperations);
  
    const updatedConfig = await this.prisma.scheduleConfig.findUnique({
      where: { vetId },
      include: { days: true },
    });
  
    return scheduleConfigToScheduleConfigResponse(
      updatedConfig as ScheduleConfig & { days: ScheduleConfigDay[] },
    );
  }

  async getScheduleConfig(vetId: string): Promise<ScheduleConfigResponse> {
    const userFound = await this.userExists(vetId);
    if (!userFound) throw new NotFoundException('Usuario no encontrado');
    if (userFound.role !== EUserRole.VETERINARIO)
      throw new ForbiddenException('El usuario no es un veterinario');
    const scheduleConfig = await this.prisma.scheduleConfig.findUnique({
      where: { vetId },
      include: { days: true },
    });
    if (!scheduleConfig)
      throw new NotFoundException('Configuración de agenda no encontrada');
    return scheduleConfigToScheduleConfigResponse(
      scheduleConfig as ScheduleConfig & { days: ScheduleConfigDay[] },
    );
  }

  async userExists(vetId: string): Promise<User | null> {
    const userFound = await this.prisma.user.findUnique({
      where: { id: vetId },
    });
    return userFound;
  }

  private validateDayUpdate(
    dayToUpdate: ScheduleConfigDayForUpdateDto,
    currentDay: ScheduleConfigDay,
  ) {
    const { startTime, endTime, weekday } = dayToUpdate;
  
    const newStart = typeof startTime === 'number' ? startTime : currentDay.startTime;
    const newEnd = typeof endTime === 'number' ? endTime : currentDay.endTime;
  
    const MAX_MINUTES_IN_DAY = 1440;
  
    if (newStart < 0 || newStart > MAX_MINUTES_IN_DAY) {
      throw new BadRequestException(
        `La hora de inicio debe estar entre 0 y ${MAX_MINUTES_IN_DAY} para el día ${weekday}`,
      );
    }
  
    if (newEnd < 0 || newEnd > MAX_MINUTES_IN_DAY) {
      throw new BadRequestException(
        `La hora de fin debe estar entre 0 y ${MAX_MINUTES_IN_DAY} para el día ${weekday}`,
      );
    }
  
    if (newStart >= newEnd) {
      throw new BadRequestException(
        `La hora de inicio debe ser menor a la hora de fin para el día ${weekday}`,
      );
    }
  }

  async getScheduleConfigByVetId(vetId: string): Promise<ScheduleConfig & { days: ScheduleConfigDay[] } | null> {
    const scheduleConfig = await this.prisma.scheduleConfig.findUnique({
      where: { vetId },
      include: { days: true },
    });
    return scheduleConfig;
  }
  
}
