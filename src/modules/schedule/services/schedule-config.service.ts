import { Injectable } from '@nestjs/common';
import { EWeekDay, ScheduleConfig } from 'generated/prisma';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ScheduleConfigDayService } from './schedule-config-day.service';

@Injectable()
export class ScheduleConfigService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scheduleConfigDayService: ScheduleConfigDayService
  ) {}

  async initializeScheduleConfig(vetId: string): Promise<ScheduleConfig> {
    return this.prisma.$transaction(async (tx) => {
      const scheduleConfig = await tx.scheduleConfig.create({
        data: { vetId },
      });
  
      const daysData = Object.values(EWeekDay).map((weekday) => ({
        scheduleId: scheduleConfig.id,
        weekday,
        startTime: 9 * 60,   // 9:00 AM en minutos
        endTime: 18 * 60,    // 6:00 PM en minutos
      }));
  
      await Promise.all(
        daysData.map((day) => tx.scheduleConfigDay.create({ data: day }))
      );
  
      // Para devolver la config con los días cargados
      const fullScheduleConfig = await tx.scheduleConfig.findUnique({
        where: { id: scheduleConfig.id },
        include: { days: true },
      });
  
      return fullScheduleConfig!;
    });
  }
  
}
