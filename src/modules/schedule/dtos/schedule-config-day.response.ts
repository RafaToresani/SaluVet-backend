import { EWeekDay } from "generated/prisma";

export class ScheduleConfigDayResponse {
  id: string;
  scheduleId: string;
  weekday: EWeekDay;
  startTime: number;
  endTime: number;
}