import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { prismaMock } from 'test/mocks/prisma.mock';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ClinicalServicesService } from 'src/modules/clinical-services/services/clinical-services.service';
import { clinicalServicesServiceMock } from 'test/mocks/clinical-services/clinical-services.service.mock';
import { PetsService } from 'src/modules/pets/services/pets.service';
import { petsServiceMock } from 'test/mocks/pets/pets.service.mock';
import { UsersService } from 'src/modules/users/services/users.service';
import { usersServiceMock } from 'test/mocks/users/users.service.mock';
import { ScheduleConfigService } from 'src/modules/schedule/services/schedule-config.service';
import { scheduleConfigServiceMock } from 'test/mocks/schedule-config/schedule-config.service.mock';
import { clinicalServiceMock } from 'test/mocks/clinical-services/clinical-services.mock';
import { scheduleConfigMock, scheduleConfigThursdayMock } from 'test/mocks/schedule-config/schedule-config.mock';
import { appointmentDtoMock, appointmentMock } from 'test/mocks/appointments/appointment.mock';
import { EAppointmentStatus, EWeekDay, ScheduleConfigDay } from 'generated/prisma';

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: ClinicalServicesService, useValue: clinicalServicesServiceMock },
        { provide: PetsService, useValue: petsServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
        { provide: ScheduleConfigService, useValue: scheduleConfigServiceMock },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAppointment', () => {
    it('should create an appointment successfully', async () => {
      petsServiceMock.getPetById.mockResolvedValue({ id: '1' });
      usersServiceMock.getUserById.mockResolvedValue({ id: '1', role: 'VETERINARIO' });
      clinicalServicesServiceMock.validateUserCanPerformServices.mockResolvedValue(undefined);
      clinicalServicesServiceMock.getClinicalServiceById.mockResolvedValue(clinicalServiceMock);
      scheduleConfigServiceMock.getScheduleConfigByVetId.mockResolvedValue(scheduleConfigMock);
  
      prismaMock.appointment.findMany.mockResolvedValue([]);
  
      prismaMock.$transaction.mockImplementation(async (cb) => {
        return await cb(prismaMock);
      });
      prismaMock.appointment.create.mockResolvedValue(appointmentMock);
  
      jest.spyOn(service, 'getAppointmentByIdToResponse').mockResolvedValue(appointmentMock as any);
  
      const result = await service.createAppointment(appointmentDtoMock);
  
      expect(result).toEqual(appointmentMock);
      expect(petsServiceMock.getPetById).toHaveBeenCalledWith(appointmentDtoMock.petId);
      expect(usersServiceMock.getUserById).toHaveBeenCalledWith(appointmentDtoMock.vetId);
      expect(clinicalServicesServiceMock.validateUserCanPerformServices).toHaveBeenCalled();
      expect(scheduleConfigServiceMock.getScheduleConfigByVetId).toHaveBeenCalledWith(appointmentDtoMock.vetId);
      expect(prismaMock.appointment.create).toHaveBeenCalled();
      expect(service.getAppointmentByIdToResponse).toHaveBeenCalledWith(appointmentMock.id);
    });
    it('should throw if pet is not found', async () => {
      petsServiceMock.getPetById.mockResolvedValue(null);
    
      await expect(service.createAppointment(appointmentDtoMock)).rejects.toThrow('Mascota no encontrada');
    });
    it('should throw if vet is not found', async () => {
      petsServiceMock.getPetById.mockResolvedValue({ id: '1' });
      usersServiceMock.getUserById.mockResolvedValue(null);
    
      await expect(service.createAppointment(appointmentDtoMock)).rejects.toThrow('Veterinario no encontrado');
    });
    it('should throw if user is not a vet', async () => {
      petsServiceMock.getPetById.mockResolvedValue({ id: '1' });
      usersServiceMock.getUserById.mockResolvedValue({ id: '1', role: 'RECEPCIONISTA' });
    
      await expect(service.createAppointment(appointmentDtoMock)).rejects.toThrow('El usuario no es un veterinario');
    });
    it('should throw if duplicate services are provided', async () => {
      const duplicatedDto = {
        ...appointmentDtoMock,
        services: [
          { clinicalServiceId: '1' },
          { clinicalServiceId: '1' },
        ],
      };
    
      petsServiceMock.getPetById.mockResolvedValue({ id: '1' });
      usersServiceMock.getUserById.mockResolvedValue({ id: '1', role: 'VETERINARIO' });
    
      await expect(service.createAppointment(duplicatedDto)).rejects.toThrow('No se permiten servicios duplicados');
    });
    it('should throw if clinical service is not found', async () => {
      petsServiceMock.getPetById.mockResolvedValue({ id: '1' });
      usersServiceMock.getUserById.mockResolvedValue({ id: '1', role: 'VETERINARIO' });
      clinicalServicesServiceMock.validateUserCanPerformServices.mockResolvedValue(undefined);
      clinicalServicesServiceMock.getClinicalServiceById.mockResolvedValue(null);
    
      await expect(service.createAppointment(appointmentDtoMock)).rejects.toThrow('Servicio no encontrado');
    });
    it('should throw if clinical service is not active', async () => {
      petsServiceMock.getPetById.mockResolvedValue({ id: '1' });
      usersServiceMock.getUserById.mockResolvedValue({ id: '1', role: 'VETERINARIO' });
      clinicalServicesServiceMock.validateUserCanPerformServices.mockResolvedValue(undefined);
      clinicalServicesServiceMock.getClinicalServiceById.mockResolvedValue({ ...clinicalServiceMock, isActive: false });
    
      await expect(service.createAppointment(appointmentDtoMock)).rejects.toThrow('El servicio no está activo');
    });
    it('should throw if schedule config is not found', async () => {
      petsServiceMock.getPetById.mockResolvedValue({ id: '1' });
      usersServiceMock.getUserById.mockResolvedValue({ id: '1', role: 'VETERINARIO' });
      clinicalServicesServiceMock.validateUserCanPerformServices.mockResolvedValue(undefined);
      clinicalServicesServiceMock.getClinicalServiceById.mockResolvedValue(clinicalServiceMock);
      scheduleConfigServiceMock.getScheduleConfigByVetId.mockResolvedValue(null);
    
      await expect(service.createAppointment(appointmentDtoMock)).rejects.toThrow('Configuración de agenda no encontrada');
    });
    it('should throw if appointment date is in the past', async () => {
      petsServiceMock.getPetById.mockResolvedValue({ id: '1' });
      usersServiceMock.getUserById.mockResolvedValue({ id: '1', role: 'VETERINARIO' });
      clinicalServicesServiceMock.validateUserCanPerformServices.mockResolvedValue(undefined);
      clinicalServicesServiceMock.getClinicalServiceById.mockResolvedValue(clinicalServiceMock);
      scheduleConfigServiceMock.getScheduleConfigByVetId.mockResolvedValue(scheduleConfigMock);
    
      const pastDto = { ...appointmentDtoMock, date: new Date('2000-01-01') };
    
      await expect(service.createAppointment(pastDto)).rejects.toThrow('La fecha de la cita no puede ser en el pasado');
    });
    it('should throw if appointment is outside of working hours', async () => {
      petsServiceMock.getPetById.mockResolvedValue({ id: '1' });
      usersServiceMock.getUserById.mockResolvedValue({ id: '1', role: 'VETERINARIO' });
      clinicalServicesServiceMock.validateUserCanPerformServices.mockResolvedValue(undefined);
      clinicalServicesServiceMock.getClinicalServiceById.mockResolvedValue(clinicalServiceMock);
      scheduleConfigServiceMock.getScheduleConfigByVetId.mockResolvedValue(scheduleConfigMock);
    
      const invalidTimeDto = { ...appointmentDtoMock, startTime: 0 };
    
      await expect(service.createAppointment(invalidTimeDto)).rejects.toThrow('El horario de inicio no es válido');
    });
    it('should throw if appointment overlaps with another', async () => {
      petsServiceMock.getPetById.mockResolvedValue({ id: '1' });
      usersServiceMock.getUserById.mockResolvedValue({ id: '1', role: 'VETERINARIO' });
      clinicalServicesServiceMock.validateUserCanPerformServices.mockResolvedValue(undefined);
      clinicalServicesServiceMock.getClinicalServiceById.mockResolvedValue(clinicalServiceMock);
      scheduleConfigServiceMock.getScheduleConfigByVetId.mockResolvedValue(scheduleConfigMock);
    
      prismaMock.appointment.findMany.mockResolvedValue([
        { id: 'prev', startTime: appointmentDtoMock.startTime, duration: 60 },
      ]);
    
      await expect(service.createAppointment(appointmentDtoMock)).rejects.toThrow('Ya existe un turno que se solapa con el horario solicitado');
    });
    
  });
  describe('rescheduleAppointment', () => {
    it('should reschedule appointment successfully', async () => {
      // Mock turno original
      prismaMock.appointment.findUnique.mockResolvedValue(appointmentMock);
    
      // Mock config de agenda
      scheduleConfigServiceMock.getScheduleConfigByVetId.mockResolvedValue(scheduleConfigMock);
    
      // Mock solapamiento (no hay otros turnos)
      prismaMock.appointment.findMany.mockResolvedValue([]);
    
      // Mock actualización
      const updatedAppointment = {
        ...appointmentMock,
        date: new Date('2026-01-02'),
        startTime: 600,
      };
    
      prismaMock.appointment.update.mockResolvedValue(updatedAppointment);
    
      // Mock de getAppointmentByIdToResponse
      jest
        .spyOn(service, 'getAppointmentByIdToResponse')
        .mockResolvedValue(updatedAppointment as any);
    
      const result = await service.rescheduleAppointment(appointmentMock.id, {
        newDate: new Date('2026-01-02'),
        newStartTime: 600,
      });
    
      expect(result).toEqual(updatedAppointment);
      expect(prismaMock.appointment.findUnique).toHaveBeenCalledWith({
        where: { id: appointmentMock.id },
        include: {
          services: {
            include: { clinicalService: true },
          },
        },
      });
      expect(scheduleConfigServiceMock.getScheduleConfigByVetId).toHaveBeenCalledWith(appointmentMock.vetId);
      expect(prismaMock.appointment.update).toHaveBeenCalledWith({
        where: { id: appointmentMock.id },
        data: {
          date: new Date('2026-01-02'),
          startTime: 600,
        },
        include: {
          vet: true,
          pet: {
            include: {
              owner: true,
            },
          },
          services: {
            include: {
              clinicalService: true,
            },
          },
        },
      });
      expect(service.getAppointmentByIdToResponse).toHaveBeenCalledWith(appointmentMock.id);
    });
    
    it('should reschedule an appointment successfully', async () => {
      petsServiceMock.getPetById.mockResolvedValue({ id: '1' });
      usersServiceMock.getUserById.mockResolvedValue({ id: '1', role: 'VETERINARIO' });
      clinicalServicesServiceMock.validateUserCanPerformServices.mockResolvedValue(undefined);
      clinicalServicesServiceMock.getClinicalServiceById.mockResolvedValue(clinicalServiceMock);
      scheduleConfigServiceMock.getScheduleConfigByVetId.mockResolvedValue(scheduleConfigMock);
    });
    it('should throw if neither newDate nor newStartTime is provided', async () => {
      await expect(service.rescheduleAppointment('1', {} as any)).rejects.toThrow(
        'Debe enviar al menos una modificación',
      );
    });
    it('should throw if appointment not found', async () => {
      prismaMock.appointment.findUnique.mockResolvedValue(null);
      await expect(service.rescheduleAppointment('1', { newDate: new Date() })).rejects.toThrow(
        'Turno no encontrado',
      );
    });
    it('should throw if appointment is cancelled', async () => {
      prismaMock.appointment.findUnique.mockResolvedValue({
        ...appointmentMock,
        status: 'CANCELADO',
      });
      await expect(service.rescheduleAppointment('1', { newDate: new Date() })).rejects.toThrow(
        'No se puede reprogramar un turno cancelado',
      );
    });
    it('should throw if new date is in the past', async () => {
      prismaMock.appointment.findUnique.mockResolvedValue(appointmentMock);
      scheduleConfigServiceMock.getScheduleConfigByVetId.mockResolvedValue(scheduleConfigMock);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
    
      await expect(
        service.rescheduleAppointment('1', { newDate: yesterday }),
      ).rejects.toThrow('No se puede reprogramar al pasado');
    });
    it('should throw if schedule config not found', async () => {
      prismaMock.appointment.findUnique.mockResolvedValue(appointmentMock);
      scheduleConfigServiceMock.getScheduleConfigByVetId.mockResolvedValue(null);
    
      await expect(
        service.rescheduleAppointment('1', { newDate: new Date('2026-01-01') }),
      ).rejects.toThrow('Configuración de agenda no encontrada');
    });
    it('should throw if appointment overlaps with another', async () => {
      // Turno original (válido)
      prismaMock.appointment.findUnique.mockResolvedValue({
        ...appointmentMock,
        startTime: 600, // 10:00
        duration: 60,
        date: new Date('2026-01-01'),
      });
    
      // Agenda con disponibilidad suficiente
      scheduleConfigServiceMock.getScheduleConfigByVetId.mockResolvedValue({
        ...scheduleConfigMock,
        days: scheduleConfigMock.days.map((day: ScheduleConfigDay) =>
          day.weekday === new Date('2026-01-01').getDay()
            ? { ...day, startTime: 480, endTime: 1080, isActive: true } // 08:00 - 18:00
            : day,
        ),
      });
    
      // Otro turno que se solapa con el nuevo horario propuesto (10:00-11:00)
      prismaMock.appointment.findMany.mockResolvedValue([
        {
          id: 'otro-turno',
          startTime: 630, // 10:30
          duration: 60,   // hasta las 11:30
        },
      ]);
    
      await expect(
        service.rescheduleAppointment(appointmentMock.id, {
          newDate: new Date('2026-01-01'),
          newStartTime: 600, // 10:00
        }),
      ).rejects.toThrow('Ya existe un turno que se solapa con el horario solicitado');
    });             
  });
  describe('getAppointmentsByVetId', () => {
    const validVetId = '1';
    const validDate = new Date('2026-05-01');
    
  
    it('should return appointments for a valid vet and date', async () => {
      usersServiceMock.getUserById.mockResolvedValue({ id: validVetId, role: 'VETERINARIO' });
      const appointmentsMock = [{
        ...appointmentMock,
        vet: { id: '1', name: 'Dr. Veterinario' },
        pet: {
          id: '1',
          name: 'Firulais',
          owner: {
            id: '10',
            name: 'Rafa',
          },
        },
        services: [{
          clinicalService: {
            id: 's1',
            name: 'Consulta General',
            price: 500,
            duration: 30,
          },
        }],
      }];
      usersServiceMock.getUserById.mockResolvedValue({ id: validVetId, role: 'VETERINARIO' });
      prismaMock.appointment.findMany.mockResolvedValue(appointmentsMock);
  
      const result = await service.getAppointmentsByVetId(validVetId, validDate);
  
      expect(usersServiceMock.getUserById).toHaveBeenCalledWith(validVetId);
      expect(prismaMock.appointment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            vetId: validVetId,
            date: expect.objectContaining({
              gte: expect.any(Date),
              lte: expect.any(Date),
            }),
          }),
          orderBy: { startTime: 'asc' },
        }),
      );
      expect(result).toHaveLength(appointmentsMock.length);
    });
  
    it('should throw BadRequestException if date is invalid', async () => {
      await expect(service.getAppointmentsByVetId(validVetId, new Date('invalid-date'))).rejects.toThrow('Fecha inválida');
    });
  
    it('should throw NotFoundException if vet not found', async () => {
      usersServiceMock.getUserById.mockResolvedValue(null);
      await expect(service.getAppointmentsByVetId(validVetId, validDate)).rejects.toThrow('Veterinario no encontrado');
    });
  
    it('should throw BadRequestException if user is not a veterinarian', async () => {
      usersServiceMock.getUserById.mockResolvedValue({ id: validVetId, role: 'CLIENTE' });
      await expect(service.getAppointmentsByVetId(validVetId, validDate)).rejects.toThrow('El usuario no es un veterinario');
    });
  
    it('should throw NotFoundException if no appointments found', async () => {
      usersServiceMock.getUserById.mockResolvedValue({ id: validVetId, role: 'VETERINARIO' });
      prismaMock.appointment.findMany.mockResolvedValue([]);
      await expect(service.getAppointmentsByVetId(validVetId, validDate)).rejects.toThrow('No se encontraron citas en la fecha especificada');
    });
  });
  describe('getAppointmentsByDate', () => {
    const validDate = new Date('2026-01-01');
  
    it('should return appointments for a valid date', async () => {
      const appointmentsMock = [{
        ...appointmentMock,
        vet: { id: '1', name: 'Dr. Veterinario' },
        pet: {
          ...appointmentMock.pet,
          owner: { id: '10', name: 'Rafa' },
        },
        services: [{
          clinicalService: {
            id: 's1',
            name: 'Consulta General',
            price: 500,
            duration: 30,
          },
        }],
      }];
  
      prismaMock.appointment.findMany.mockResolvedValue(appointmentsMock);
  
      const result = await service.getAppointmentsByDate(validDate);
  
      expect(prismaMock.appointment.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: {
          date: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
        orderBy: { startTime: 'asc' },
        include: expect.any(Object),
      }));
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(appointmentMock.id);
    });
  
    it('should throw BadRequestException if date is invalid', async () => {
      await expect(service.getAppointmentsByDate(new Date('invalid-date'))).rejects.toThrow('Fecha inválida');
    });
  
    it('should return empty array if no appointments found', async () => {
      prismaMock.appointment.findMany.mockResolvedValue([]);
      const result = await service.getAppointmentsByDate(validDate);
      expect(result).toEqual([]);
    });
  });
  describe('getAppointmentsByPetId', () => {
    const petId = 'pet-1';
  
    it('should return appointments for a valid pet', async () => {
      petsServiceMock.getPetById.mockResolvedValue({ id: petId });
  
      prismaMock.appointment.findMany.mockResolvedValue([
        {
          ...appointmentMock,
          vet: { id: '1', name: 'Dr. Vet' },
          pet: {
            ...appointmentMock.pet,
            owner: { id: 'owner-1', name: 'Dueño' },
          },
          services: [
            {
              clinicalService: {
                id: '1',
                name: 'Consulta',
                duration: 30,
                price: 500,
              },
            },
          ],
        },
      ]);
  
      const result = await service.getAppointmentsByPetId(petId);
  
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(appointmentMock.id);
      expect(petsServiceMock.getPetById).toHaveBeenCalledWith(petId);
      expect(prismaMock.appointment.findMany).toHaveBeenCalledWith({
        where: { petId },
        include: {
          vet: true,
          pet: {
            include: {
              owner: true,
            },
          },
          services: {
            include: {
              clinicalService: true,
            },
          },
        },
        orderBy: [
          { date: 'desc' },
          { startTime: 'desc' },
        ],
      });
    });
  
    it('should throw NotFoundException if pet does not exist', async () => {
      petsServiceMock.getPetById.mockResolvedValue(null);
      await expect(service.getAppointmentsByPetId(petId)).rejects.toThrow('Mascota no encontrada');
    });
  
    it('should throw NotFoundException if no appointments found', async () => {
      petsServiceMock.getPetById.mockResolvedValue({ id: petId });
      prismaMock.appointment.findMany.mockResolvedValue(null); // este caso aplica si findMany retorna null (aunque normalmente devuelve array vacío)
      await expect(service.getAppointmentsByPetId(petId)).rejects.toThrow('No se encontraron citas para esta mascota');
    });
  });
  describe('updateAppointmentStatus', () => {
    it('should update appointment status successfully', async () => {
      const appointmentId = '1';
      const newStatus = EAppointmentStatus.CANCELADO;
    
      prismaMock.appointment.findUnique.mockResolvedValue(appointmentMock);
    
      const updatedAppointment = {
        ...appointmentMock,
        status: newStatus,
      };
    
      prismaMock.appointment.update.mockResolvedValue(updatedAppointment);
      jest.spyOn(service, 'getAppointmentByIdToResponse').mockResolvedValue(updatedAppointment as any);
    
      const result = await service.updateAppointmentStatus(appointmentId, newStatus);
    
      expect(result).toEqual(updatedAppointment);
      expect(prismaMock.appointment.findUnique).toHaveBeenCalledWith({ where: { id: appointmentId } });
      expect(prismaMock.appointment.update).toHaveBeenCalledWith({
        where: { id: appointmentId },
        data: { status: newStatus },
        include: {
          vet: true,
          pet: { include: { owner: true } },
          services: { include: { clinicalService: true } },
        },
      });
      expect(service.getAppointmentByIdToResponse).toHaveBeenCalledWith(appointmentId);
    });
    it('should throw BadRequestException if status is invalid', async () => {
      await expect(service.updateAppointmentStatus('1', 'INVALIDO' as any)).rejects.toThrow('Estado inválido');
    });
    
    it('should throw NotFoundException if appointment does not exist', async () => {
      prismaMock.appointment.findUnique.mockResolvedValue(null);
      await expect(service.updateAppointmentStatus('1', EAppointmentStatus.COMPLETO)).rejects.toThrow('Cita no encontrada');
    });
    
    it('should throw NotFoundException if update fails', async () => {
      prismaMock.appointment.findUnique.mockResolvedValue(appointmentMock);
      prismaMock.appointment.update.mockResolvedValue(null);
    
      await expect(service.updateAppointmentStatus('1', EAppointmentStatus.COMPLETO)).rejects.toThrow('Error al actualizar el estado de la cita');
    });
    
  });

  describe('validateAvailability', () => {
    it('should pass validation if all conditions are met', () => {
      const date = new Date('2026-01-01'); // Jueves
      const startTime = 600;
      const duration = 60;
  
      expect(() =>
        service['validateAvailability'](scheduleConfigMock, date, startTime, duration),
      ).not.toThrow();
    });
  
    it('should throw NotFoundException if dayConfig is not found', () => {
      const date = new Date('2026-01-01'); // Jueves
      const weekday = service['getWeekDay'](date); // Debería ser JUEVES (4)
  
      const customConfig = {
        ...scheduleConfigMock,
        days: scheduleConfigMock.days.filter((d) => d.weekday !== weekday),
      };
  
      expect(() =>
        service['validateAvailability'](customConfig, date, 600, 60),
      ).toThrow('Configuración de agenda no encontrada');
    });
  
    it('should throw BadRequestException if day is inactive', () => {
      const date = new Date('2026-01-01'); // Jueves
      const weekday = service['getWeekDay'](date);
  
      const config = {
        ...scheduleConfigMock,
        days: scheduleConfigMock.days.map((d) =>
          d.weekday === weekday ? { ...d, isActive: false } : d,
        ),
      };
  
      expect(() =>
        service['validateAvailability'](config, date, 600, 60),
      ).toThrow('El veterinario no está disponible en este día');
    });
  
    it('should throw BadRequestException if startTime is before day startTime', () => {
      const date = new Date('2026-01-01');
      expect(() =>
        service['validateAvailability'](scheduleConfigMock, date, 300, 60),
      ).toThrow('El horario de inicio no es válido');
    });
  
    it('should throw BadRequestException if endTime exceeds day endTime', () => {
      const date = new Date('2026-01-01');
      expect(() =>
        service['validateAvailability'](scheduleConfigMock, date, 1050, 60),
      ).toThrow('La duración de la cita supera el horario de fin de la jornada');
    });
  });
  
  describe('validateNoOverlap', () => {
    const vetId = 'vet-1';
    const date = new Date('2026-01-01');
    const duration = 60;
  
    it('should pass if there are no existing appointments', async () => {
      prismaMock.appointment.findMany.mockResolvedValue([]);
  
      await expect(
        service['validateNoOverlap'](vetId, date, 600, duration),
      ).resolves.not.toThrow();
    });
  
    it('should throw if new appointment overlaps with an existing one', async () => {
      prismaMock.appointment.findMany.mockResolvedValue([
        { startTime: 600, duration: 60 }, // 10:00 - 11:00
      ]);
  
      // New appointment from 10:30 to 11:30 overlaps
      await expect(
        service['validateNoOverlap'](vetId, date, 630, duration),
      ).rejects.toThrow('Ya existe un turno que se solapa con el horario solicitado');
    });
  
    it('should pass if new appointment is just after existing one', async () => {
      prismaMock.appointment.findMany.mockResolvedValue([
        { startTime: 600, duration: 60 }, // 10:00 - 11:00
      ]);
  
      // New appointment from 11:00 to 12:00 no overlap
      await expect(
        service['validateNoOverlap'](vetId, date, 660, duration),
      ).resolves.not.toThrow();
    });
  
    it('should pass if new appointment is just before existing one', async () => {
      prismaMock.appointment.findMany.mockResolvedValue([
        { startTime: 660, duration: 60 }, // 11:00 - 12:00
      ]);
  
      // New appointment from 10:00 to 11:00 no overlap
      await expect(
        service['validateNoOverlap'](vetId, date, 600, duration),
      ).resolves.not.toThrow();
    });
  });
  
  describe('getWeekDay', () => {
    it('should correctly map JS Date.getDay() to EWeekDay', () => {
      const daysJs = [0, 1, 2, 3, 4, 5, 6];
      const expectedEWeekDays = [
        EWeekDay.DOMINGO,
        EWeekDay.LUNES,
        EWeekDay.MARTES,
        EWeekDay.MIERCOLES,
        EWeekDay.JUEVES,
        EWeekDay.VIERNES,
        EWeekDay.SABADO,
      ];
  
      daysJs.forEach((jsDay, index) => {
        // Construir fecha arbitraria que tenga getDay() === jsDay
        // Por ejemplo, 2023-08-06 es domingo (0)
        const baseDate = new Date('2023-08-06T00:00:00Z');
        const testDate = new Date(baseDate);
        // Ajustamos días para tener el día correcto (mod 7)
        testDate.setDate(baseDate.getDate() + ((jsDay + 7 - baseDate.getDay()) % 7));
  
        const result = service['getWeekDay'](testDate);
        expect(result).toBe(expectedEWeekDays[index]);
      });
    });
  });
  describe('getAppointmentById', () => {
    it('should return appointment if found', async () => {
      const appointmentMock = { id: '1', date: new Date(), startTime: 600 }; // tu mock básico
  
      prismaMock.appointment.findUnique.mockResolvedValue(appointmentMock);
  
      const result = await service.getAppointmentById('1');
  
      expect(result).toEqual(appointmentMock);
      expect(prismaMock.appointment.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  
    it('should throw NotFoundException if appointment not found', async () => {
      prismaMock.appointment.findUnique.mockResolvedValue(null);
  
      await expect(service.getAppointmentById('2')).rejects.toThrow('Cita no encontrada');
    });
  });
  

  
});
