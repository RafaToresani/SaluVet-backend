import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleConfigController } from './schedule-config.controller';
import { ScheduleConfigService } from '../services/schedule-config.service';
import { scheduleConfigMock } from 'test/mocks/schedule-config/schedule-config.mock';
import { scheduleConfigServiceMock } from 'test/mocks/schedule-config/schedule-config.service.mock';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('ScheduleConfigController', () => {
  let controller: ScheduleConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleConfigController],
      providers: [
        { provide: ScheduleConfigService, useValue:  scheduleConfigServiceMock},
      ],
    }).compile();

    controller = module.get<ScheduleConfigController>(ScheduleConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getScheduleConfig', () => {
    it('should return the schedule config', async () => {
      scheduleConfigServiceMock.getScheduleConfig.mockResolvedValue(scheduleConfigMock);
      const result = await controller.getScheduleConfig(scheduleConfigMock.vetId);
      expect(result).toEqual(scheduleConfigMock);
    });
    it('should throw an error if the user is not found', async () => {
      scheduleConfigServiceMock.getScheduleConfig.mockRejectedValue(new NotFoundException('Usuario no encontrado'));
      await expect(controller.getScheduleConfig(scheduleConfigMock.vetId)).rejects.toThrow(NotFoundException);
    });
    it('should throw an error if the user is not a veterinarian', async () => {
      scheduleConfigServiceMock.getScheduleConfig.mockRejectedValue(new ForbiddenException('El usuario no es un veterinario'));
      await expect(controller.getScheduleConfig(scheduleConfigMock.vetId)).rejects.toThrow(ForbiddenException);
    });
    it('should throw an error if the schedule config is not found', async () => {
      scheduleConfigServiceMock.getScheduleConfig.mockRejectedValue(new NotFoundException('Configuración de agenda no encontrada'));
      await expect(controller.getScheduleConfig(scheduleConfigMock.vetId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMyScheduleConfig', () => {
    it('should return the schedule config', async () => {
      scheduleConfigServiceMock.getScheduleConfig.mockResolvedValue(scheduleConfigMock);
      const result = await controller.getMyScheduleConfig(scheduleConfigMock.vetId);
      expect(result).toEqual(scheduleConfigMock);
    });
    it('should throw an error if the user is not found', async () => {
      scheduleConfigServiceMock.getScheduleConfig.mockRejectedValue(new NotFoundException('Usuario no encontrado'));
      await expect(controller.getMyScheduleConfig(scheduleConfigMock.vetId)).rejects.toThrow(NotFoundException);
    });
    it('should throw an error if the user is not a veterinarian', async () => {
      scheduleConfigServiceMock.getScheduleConfig.mockRejectedValue(new ForbiddenException('El usuario no es un veterinario'));
      await expect(controller.getMyScheduleConfig(scheduleConfigMock.vetId)).rejects.toThrow(ForbiddenException);
    });
    it('should throw an error if the schedule config is not found', async () => {
      scheduleConfigServiceMock.getScheduleConfig.mockRejectedValue(new NotFoundException('Configuración de agenda no encontrada'));
      await expect(controller.getMyScheduleConfig(scheduleConfigMock.vetId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateScheduleConfig', () => {
    it('should update the schedule config', async () => {
      scheduleConfigServiceMock.updateScheduleConfig.mockResolvedValue(scheduleConfigMock);
        const updateDtoMock = {
        days: scheduleConfigMock.days.map(day => ({
          weekday: day.weekday,
          startTime: day.startTime,
          endTime: day.endTime,
          isActive: day.isActive,
        })),
      };

      const result = await controller.updateScheduleConfig(scheduleConfigMock.vetId, updateDtoMock);
  
      expect(result).toEqual(scheduleConfigMock);
      expect(scheduleConfigServiceMock.updateScheduleConfig).toHaveBeenCalledWith(scheduleConfigMock.vetId, updateDtoMock);
    });
    it('should throw an error if the user is not found', async () => {
      scheduleConfigServiceMock.updateScheduleConfig.mockRejectedValue(new NotFoundException('Usuario no encontrado'));
      await expect(controller.updateScheduleConfig(scheduleConfigMock.vetId, scheduleConfigMock)).rejects.toThrow(NotFoundException);
    });
    it('should throw an error if the user is not a veterinarian', async () => {
      scheduleConfigServiceMock.updateScheduleConfig.mockRejectedValue(new ForbiddenException('El usuario no es un veterinario'));
      await expect(controller.updateScheduleConfig(scheduleConfigMock.vetId, scheduleConfigMock)).rejects.toThrow(ForbiddenException);
    });
    it('should throw an error if the schedule config is not found', async () => {
      scheduleConfigServiceMock.updateScheduleConfig.mockRejectedValue(new NotFoundException('Configuración de agenda no encontrada'));
      await expect(controller.updateScheduleConfig(scheduleConfigMock.vetId, scheduleConfigMock)).rejects.toThrow(NotFoundException);
    });
  });

});
