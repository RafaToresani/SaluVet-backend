import { EWeekDay } from 'generated/prisma';
import { userVeterinarioMock } from '../users/users.mock';

export const scheduleConfigMondayMock = {
  id: 'day-1',
  scheduleId: 'schedule-1',
  weekday: EWeekDay.LUNES,
  startTime: 480,
  endTime: 1080,
  isActive: true,
  createdAt: new Date('2025-01-01T08:00:00Z'),
  updatedAt: new Date('2025-01-01T08:00:00Z'),
};

export const scheduleConfigTuesdayMock = {
  id: 'day-2',
  scheduleId: 'schedule-1',
  weekday: EWeekDay.MARTES,
  startTime: 480,
  endTime: 1080,
  isActive: true,
  createdAt: new Date('2025-01-02T08:00:00Z'),
  updatedAt: new Date('2025-01-02T08:00:00Z'),
};

export const scheduleConfigWednesdayMock = {
  id: 'day-3',
  scheduleId: 'schedule-1',
  weekday: EWeekDay.MIERCOLES,
  startTime: 480,
  endTime: 1080,
  isActive: true,
  createdAt: new Date('2025-01-03T08:00:00Z'),
  updatedAt: new Date('2025-01-03T08:00:00Z'),
};

export const scheduleConfigThursdayMock = {
  id: 'day-4',
  scheduleId: 'schedule-1',
  weekday: EWeekDay.JUEVES,
  startTime: 480,
  endTime: 1080,
  isActive: true,
  createdAt: new Date('2025-01-04T08:00:00Z'),
  updatedAt: new Date('2025-01-04T08:00:00Z'),
};

export const scheduleConfigFridayMock = {
  id: 'day-5',
  scheduleId: 'schedule-1',
  weekday: EWeekDay.VIERNES,
  startTime: 480,
  endTime: 1080,
  isActive: true,
  createdAt: new Date('2025-01-05T08:00:00Z'),
  updatedAt: new Date('2025-01-05T08:00:00Z'),
};

export const scheduleConfigSaturdayMock = {
  id: 'day-6',
  scheduleId: 'schedule-1',
  weekday: EWeekDay.SABADO,
  startTime: 480,
  endTime: 1080,
  isActive: true,
  createdAt: new Date('2025-01-06T08:00:00Z'),
  updatedAt: new Date('2025-01-06T08:00:00Z'),
};

export const scheduleConfigSundayMock = {
  id: 'day-7',
  scheduleId: 'schedule-1',
  weekday: EWeekDay.DOMINGO,
  startTime: 480,
  endTime: 1080,
  isActive: true,
  createdAt: new Date('2025-01-07T08:00:00Z'),
  updatedAt: new Date('2025-01-07T08:00:00Z'),
};

export const scheduleConfigMock = {
  id: 'schedule-1',
  vetId: userVeterinarioMock.id,
  vet: userVeterinarioMock,
  days: [
    scheduleConfigMondayMock,
    scheduleConfigTuesdayMock,
    scheduleConfigWednesdayMock,
    scheduleConfigThursdayMock,
    scheduleConfigFridayMock,
    scheduleConfigSaturdayMock,
    scheduleConfigSundayMock,
  ],
  createdAt: new Date('2025-01-01T08:00:00Z'),
  updatedAt: new Date('2025-01-01T08:00:00Z'),
};
