import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleConfigService } from './schedule-config.service';
import { prismaMock } from 'test/mocks/prisma.mock';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { configServiceMock } from 'test/mocks/config/config-service.service.mock';
import { ConfigService } from '@nestjs/config';
import { scheduleConfigMock, scheduleConfigMondayMock, scheduleConfigTuesdayMock } from 'test/mocks/schedule-config/schedule-config.mock';
import { userVeterinarioMock } from 'test/mocks/users/users.mock';
import { EUserRole, EWeekDay } from 'generated/prisma';

describe('ScheduleConfigService', () => {
  let service: ScheduleConfigService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleConfigService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<ScheduleConfigService>(ScheduleConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initializeScheduleConfig', () => {
    it('should initialize the schedule config with 7 days', async () => {
      const txMock = {
        scheduleConfig: {
          create: jest.fn().mockResolvedValue(scheduleConfigMock),
          findUnique: jest.fn().mockResolvedValue(scheduleConfigMock),
        },
        scheduleConfigDay: {
          create: jest.fn().mockResolvedValue({}),
        },
      };
  
      prismaMock.$transaction.mockImplementation(async (fn) => fn(txMock as any));
  
      configServiceMock.get = jest.fn((key) => {
        if (key === 'scheduleConfig.startTime') return 8; // 8 AM
        if (key === 'scheduleConfig.endTime') return 18; // 6 PM
        return null;
      });
  
      const result = await service.initializeScheduleConfig(userVeterinarioMock.id);
  
      expect(txMock.scheduleConfig.create).toHaveBeenCalledWith({
        data: { vetId: userVeterinarioMock.id },
      });
  
      expect(txMock.scheduleConfigDay.create).toHaveBeenCalledTimes(7);
  
      expect(txMock.scheduleConfigDay.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            scheduleId: scheduleConfigMock.id,
            startTime: 480, // 8 * 60
            endTime: 1080, // 18 * 60
          }),
        }),
      );
  
      expect(txMock.scheduleConfig.findUnique).toHaveBeenCalledWith({
        where: { id: scheduleConfigMock.id },
        include: { days: true },
      });
  
      expect(result).toEqual(scheduleConfigMock);
    });
  
    it('should throw if schedule config already exists', async () => {
      prismaMock.scheduleConfig.findUnique.mockResolvedValue(scheduleConfigMock);
      await expect(service.initializeScheduleConfig(userVeterinarioMock.id)).rejects.toThrow('El horario ya existe');
    });
  });

  describe('updateScheduleConfig', () => {
    const vetId = userVeterinarioMock.id;
  
    it('should update schedule config days successfully', async () => {
      const vetId = userVeterinarioMock.id;
      const daysToUpdate = [
        { weekday: EWeekDay.LUNES, isActive: false, startTime: 480, endTime: 1080 },
        { weekday: EWeekDay.MARTES, isActive: true, startTime: 480, endTime: 1080 },
      ];
  
      prismaMock.scheduleConfig.findUnique.mockResolvedValueOnce({
        id: '1',
        vetId,
        days: [
          { ...scheduleConfigMondayMock, isActive: true },
          { ...scheduleConfigTuesdayMock, isActive: true },
        ],
      });
  
      prismaMock.scheduleConfigDay.update.mockImplementation(({ where, data }) => {
        const day = daysToUpdate.find(d => d.weekday === (where.id === scheduleConfigMondayMock.id ? EWeekDay.MONDAY : EWeekDay.TUESDAY));
        return Promise.resolve({
          id: where.id,
          weekday: day?.weekday,
          startTime: data.startTime ?? (day?.startTime ?? 480),
          endTime: data.endTime ?? (day?.endTime ?? 1080),
          isActive: data.isActive ?? (day?.isActive ?? true),
        });
      });
      prismaMock.scheduleConfig.findUnique.mockResolvedValue({
        id: '1',
        vetId,
        days: daysToUpdate,
      });
  
      service.userExists = jest.fn().mockResolvedValue(userVeterinarioMock);
      const result = await service.updateScheduleConfig(vetId, { days: daysToUpdate });
  
      expect(result.days.length).toEqual(daysToUpdate.length);
      expect(result.days[0].isActive).toEqual(daysToUpdate[0].isActive);
      expect(result.days[1].isActive).toEqual(daysToUpdate[1].isActive);
      expect(prismaMock.scheduleConfigDay.update).toHaveBeenCalledTimes(daysToUpdate.length);
    });
  
    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'userExists').mockResolvedValue(null);
  
      await expect(
        service.updateScheduleConfig(vetId, { days: [] }),
      ).rejects.toThrow('Usuario no encontrado');
    });
  
    it('should throw ForbiddenException if user role is not VETERINARIO', async () => {
      jest.spyOn(service, 'userExists').mockResolvedValue({
        ...userVeterinarioMock,
        role: EUserRole.ADMIN,
      });
  
      await expect(
        service.updateScheduleConfig(vetId, { days: [] }),
      ).rejects.toThrow('El usuario no es un veterinario');
    });
  
    it('should throw NotFoundException if schedule config not found', async () => {
      jest.spyOn(service, 'userExists').mockResolvedValue({
        ...userVeterinarioMock,
        role: EUserRole.VETERINARIO,
      });
  
      prismaMock.scheduleConfig.findUnique.mockResolvedValue(null);
  
      await expect(
        service.updateScheduleConfig(vetId, { days: [] }),
      ).rejects.toThrow('Configuración de agenda no encontrada');
    });
  
    it('should throw NotFoundException if day to update does not exist', async () => {
      jest.spyOn(service, 'userExists').mockResolvedValue({
        ...userVeterinarioMock,
        role: EUserRole.VETERINARIO,
      });
  
      prismaMock.scheduleConfig.findUnique.mockResolvedValue(scheduleConfigMock);
  
      const invalidDays = [{ weekday: 'SUNDAY', isActive: true }];
  
      await expect(
        service.updateScheduleConfig(vetId, { days: invalidDays }),
      ).rejects.toThrow('Día SUNDAY no encontrado');
    });
  
    it('should call validateDayUpdate for each day to update', async () => {
      jest.spyOn(service, 'userExists').mockResolvedValue({
        ...userVeterinarioMock,
        role: EUserRole.VETERINARIO,
      });
  
      prismaMock.scheduleConfig.findUnique.mockResolvedValue(scheduleConfigMock);
  
      const validateSpy = jest.spyOn(service as any, 'validateDayUpdate').mockImplementation(() => {});
  
      const daysToUpdate = scheduleConfigMock.days.map(day => ({
        weekday: day.weekday,
        isActive: !day.isActive,
      }));
  
      prismaMock.scheduleConfigDay.update.mockResolvedValue(scheduleConfigMock.days[0]);
  
      await service.updateScheduleConfig(vetId, { days: daysToUpdate });
  
      expect(validateSpy).toHaveBeenCalledTimes(daysToUpdate.length);
    });
  });
  
  describe('getScheduleConfig', () => {
    it('should return the schedule config mapped correctly', async () => {
      prismaMock.scheduleConfig.findUnique.mockResolvedValue(scheduleConfigMock);
      service.userExists = jest.fn().mockResolvedValue(userVeterinarioMock);
  
      const result = await service.getScheduleConfig(userVeterinarioMock.id);
  
      expect(result.vetId).toEqual(scheduleConfigMock.vetId);
      expect(result.days.length).toEqual(scheduleConfigMock.days.length);
      expect(result.days[0].weekday).toEqual(scheduleConfigMock.days[0].weekday);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'userExists').mockResolvedValue(null);
      await expect(service.getScheduleConfig(userVeterinarioMock.id)).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('userExists', () => {
    it('should return the user if it exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(userVeterinarioMock);
      const result = await service.userExists(userVeterinarioMock.id);
      expect(result?.id).toEqual(userVeterinarioMock.id);
    });

    it('should return null if the user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      const result = await service.userExists(userVeterinarioMock.id);
      expect(result).toEqual(null);
    });
  });

  describe('validateDayUpdate', () => {
    const currentDay = { ...scheduleConfigMondayMock, isActive: true };
  
    it('should pass validation with valid times', () => {
      const dayToUpdate = { weekday: EWeekDay.MONDAY, startTime: 480, endTime: 1080 };
      expect(() => service['validateDayUpdate'](dayToUpdate, currentDay)).not.toThrow();
    });
  
    it('should allow missing startTime or endTime (use currentDay)', () => {
      expect(() =>
        service['validateDayUpdate']({ weekday: EWeekDay.MONDAY }, currentDay),
      ).not.toThrow();
    });
  
    it('should throw if startTime < 0', () => {
      const dayToUpdate = { weekday: EWeekDay.MONDAY, startTime: -1, endTime: 1080 };
      expect(() => service['validateDayUpdate'](dayToUpdate, currentDay)).toThrow(
        /La hora de inicio debe estar entre 0/,
      );
    });
  
    it('should throw if startTime > 1440', () => {
      const dayToUpdate = { weekday: EWeekDay.MONDAY, startTime: 1500, endTime: 1080 };
      expect(() => service['validateDayUpdate'](dayToUpdate, currentDay)).toThrow(
        /La hora de inicio debe estar entre 0/,
      );
    });
  
    it('should throw if endTime < 0', () => {
      const dayToUpdate = { weekday: EWeekDay.MONDAY, startTime: 480, endTime: -10 };
      expect(() => service['validateDayUpdate'](dayToUpdate, currentDay)).toThrow(
        /La hora de fin debe estar entre 0/,
      );
    });
  
    it('should throw if endTime > 1440', () => {
      const dayToUpdate = { weekday: EWeekDay.MONDAY, startTime: 480, endTime: 1500 };
      expect(() => service['validateDayUpdate'](dayToUpdate, currentDay)).toThrow(
        /La hora de fin debe estar entre 0/,
      );
    });
  
    it('should throw if startTime >= endTime', () => {
      const dayToUpdate = { weekday: EWeekDay.MONDAY, startTime: 600, endTime: 600 };
      expect(() => service['validateDayUpdate'](dayToUpdate, currentDay)).toThrow(
        /La hora de inicio debe ser menor a la hora de fin/,
      );
    });
  });

  describe('getScheduleConfigByVetId', () => {
    it('should return schedule config with days if found', async () => {
      prismaMock.scheduleConfig.findUnique.mockResolvedValue(scheduleConfigMock);
      const result = await service.getScheduleConfigByVetId(scheduleConfigMock.vetId);
      expect(result).toEqual(scheduleConfigMock);
      expect(prismaMock.scheduleConfig.findUnique).toHaveBeenCalledWith({
        where: { vetId: scheduleConfigMock.vetId },
        include: { days: true },
      });
    });
  
    it('should return null if schedule config not found', async () => {
      prismaMock.scheduleConfig.findUnique.mockResolvedValue(null);
      const result = await service.getScheduleConfigByVetId('nonexistent-id');
      expect(result).toBeNull();
    });
  });
  
  
});
