import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { appointmentServiceMock } from 'test/mocks/appointments/appointment.service.mock';
import { AppointmentsService } from '../services/appointments.service';
import { appointmentDtoMock } from 'test/mocks/appointments/appointment.mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EAppointmentStatus } from 'generated/prisma';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: appointmentServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAppointment', () => {
    it('should create an appointment', async () => {
      const appointmentDto = appointmentDtoMock;
      const createdAppointment = { id: '1', ...appointmentDto };
  
      appointmentServiceMock.createAppointment.mockResolvedValue(createdAppointment);
  
      const result = await controller.createAppointment(appointmentDto);
  
      expect(result).toEqual(createdAppointment);
      expect(appointmentServiceMock.createAppointment).toHaveBeenCalledWith(appointmentDto);
    });

    it('should throw an error if the appointment is not created', async () => {
      const appointmentDto = appointmentDtoMock;
      appointmentServiceMock.createAppointment.mockRejectedValue(new BadRequestException('Error al crear la cita'));
      await expect(controller.createAppointment(appointmentDto)).rejects.toThrow('Error al crear la cita');
    });
  });
  
  describe('getAppointmentsByDate', () => {
    it('should get appointments by date', async () => {
      const date = new Date();
      const appointments = [appointmentDtoMock];
      appointmentServiceMock.getAppointmentsByDate.mockResolvedValue(appointments);
      const result = await controller.getAppointmentsByDate(date);
      expect(result).toEqual(appointments);
    });
    it('should throw an error if getAppointmentsByDate fails', async () => {
      const date = new Date();
      appointmentServiceMock.getAppointmentsByDate.mockRejectedValue(
        new BadRequestException('Error al buscar las citas'),
      );
    
      await expect(controller.getAppointmentsByDate(date)).rejects.toThrow('Error al buscar las citas');
    });
    
  });

  describe('getAppointmentsByPetId', () => {
    it('should get appointments by pet id', async () => {
      const petId = '1';
      const appointments = [appointmentDtoMock];
      appointmentServiceMock.getAppointmentsByPetId.mockResolvedValue(appointments);
      const result = await controller.getAppointmentsByPetId(petId);
      expect(result).toEqual(appointments);
    });
    it('should throw an error if the appointments are not found', async () => {
      const petId = '1';
      appointmentServiceMock.getAppointmentsByPetId.mockRejectedValue(new NotFoundException('Citas no encontradas'));
      await expect(controller.getAppointmentsByPetId(petId)).rejects.toThrow('Citas no encontradas');
    });
  });

  describe('getAppointmentsByVetId', () => {
    it('should get appointments by vet id', async () => {
      const vetId = '1';
      const date = new Date();
      const appointments = [appointmentDtoMock];
      appointmentServiceMock.getAppointmentsByVetId.mockResolvedValue(appointments);
      const result = await controller.getAppointmentsByVetId(vetId, date);
      expect(result).toEqual(appointments);
    });
    it('should throw an error if getAppointmentsByVetId fails', async () => {
      const vetId = '1';
      const date = new Date();
      appointmentServiceMock.getAppointmentsByVetId.mockRejectedValue(
        new BadRequestException('Error al obtener citas del veterinario'),
      );
    
      await expect(controller.getAppointmentsByVetId(vetId, date)).rejects.toThrow('Error al obtener citas del veterinario');
    });
    
  });

  describe('rescheduleAppointment', () => {
    it('should reschedule an appointment', async () => {
      const id = '1';
      const rescheduleDto = { newDate: new Date('2026-01-01'), newStartTime: 600 };
      const rescheduledAppointment = { id: '1', ...rescheduleDto };
  
      appointmentServiceMock.rescheduleAppointment.mockResolvedValue(rescheduledAppointment);
  
      const result = await controller.rescheduleAppointment(id, rescheduleDto);
  
      expect(result).toEqual(rescheduledAppointment);
      expect(appointmentServiceMock.rescheduleAppointment).toHaveBeenCalledWith(id, rescheduleDto);
    });
    it('should throw an error if the appointment is not rescheduled', async () => {
      const id = '1';
      const rescheduleDto = { newDate: new Date('2026-01-01'), newStartTime: 600 };
      appointmentServiceMock.rescheduleAppointment.mockRejectedValue(new BadRequestException('Error al reprogramar la cita'));
      await expect(controller.rescheduleAppointment(id, rescheduleDto)).rejects.toThrow('Error al reprogramar la cita');
    });
    it('should throw an error if the appointment is not found', async () => {
      const id = '1';
      const rescheduleDto = { newDate: new Date('2026-01-01'), newStartTime: 600 };
      appointmentServiceMock.rescheduleAppointment.mockRejectedValue(new NotFoundException('Cita no encontrada'));
      await expect(controller.rescheduleAppointment(id, rescheduleDto)).rejects.toThrow('Cita no encontrada');
    });
  });

  describe('updateAppointmentStatus', () => {
    it('should update the status of an appointment', async () => {
      const id = '1';
      const status = EAppointmentStatus.CANCELADO;
      const updatedAppointment = { id: '1', status };
      appointmentServiceMock.updateAppointmentStatus.mockResolvedValue(updatedAppointment);
      const result = await controller.updateAppointmentStatus(id, status);
      expect(result).toEqual(updatedAppointment);
      expect(appointmentServiceMock.updateAppointmentStatus).toHaveBeenCalledWith(id, status);
    });
    it('should throw an error if update fails', async () => {
      const id = '1';
      const status = EAppointmentStatus.CANCELADO;
      appointmentServiceMock.updateAppointmentStatus.mockRejectedValue(
        new BadRequestException('Error al actualizar')
      );
      await expect(controller.updateAppointmentStatus(id, status)).rejects.toThrow('Error al actualizar');
    });
    it('should throw an error if appointment is not found', async () => {
      const id = '1';
      const status = EAppointmentStatus.CANCELADO;
      appointmentServiceMock.updateAppointmentStatus.mockRejectedValue(
        new NotFoundException('Cita no encontrada')
      );
      await expect(controller.updateAppointmentStatus(id, status)).rejects.toThrow('Cita no encontrada');
    });
  });

});
