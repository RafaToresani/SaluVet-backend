import { Injectable } from '@nestjs/common';
import { EWeekDay, ScheduleConfigDay } from 'generated/prisma';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class ScheduleConfigDayService {
  constructor(private readonly prisma: PrismaService) {}

  
}
