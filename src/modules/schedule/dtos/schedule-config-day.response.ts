import { EWeekDay } from "generated/prisma";

export class ScheduleConfigDayResponse {
  id: string;
  scheduleId: string;
  isActive: boolean;
  weekday: EWeekDay;
  startTime: number;
  endTime: number;
}