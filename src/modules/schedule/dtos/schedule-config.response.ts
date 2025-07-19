import { ScheduleConfigDayResponse } from "./schedule-config-day.response";

export class ScheduleConfigResponse {
  id: string;
  vetId: string;
  days: ScheduleConfigDayResponse[];
}

