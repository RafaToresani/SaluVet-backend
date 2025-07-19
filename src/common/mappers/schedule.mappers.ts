import { ScheduleConfig, ScheduleConfigDay } from "generated/prisma";
import { ScheduleConfigDayResponse } from "src/modules/schedule/dtos/schedule-config-day.response";
import { ScheduleConfigResponse } from "src/modules/schedule/dtos/schedule-config.response";

export function scheduleConfigToScheduleConfigResponse(scheduleConfig: ScheduleConfig & {days: ScheduleConfigDay[]}): ScheduleConfigResponse {
  return {
    id: scheduleConfig.id,
    vetId: scheduleConfig.vetId,
    days: scheduleConfig.days.map((day) => scheduleConfigDayToScheduleConfigDayResponse(day)),
  };
}

export function scheduleConfigDayToScheduleConfigDayResponse(scheduleConfigDay: ScheduleConfigDay): ScheduleConfigDayResponse {
  return {
    id: scheduleConfigDay.id,
    scheduleId: scheduleConfigDay.scheduleId,
    isActive: scheduleConfigDay.isActive,
    weekday: scheduleConfigDay.weekday,
    startTime: scheduleConfigDay.startTime,
    endTime: scheduleConfigDay.endTime,
  };
}