import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRecordsService } from './medical-records.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { prismaMock } from 'test/mocks/prisma.mock';
import { PetsService } from 'src/modules/pets/services/pets.service';
import { petsServiceMock } from 'test/mocks/pets/pets.service.mock';
import { UsersService } from 'src/modules/users/services/users.service';
import { usersServiceMock } from 'test/mocks/users/users.service.mock';
import { AppointmentsService } from 'src/modules/appointments/services/appointments.service';
import { appointmentServiceMock } from 'test/mocks/appointments/appointment.service.mock';
import {
  medicalRecordsDtoMock,
  medicalRecordsMock,
} from 'test/mocks/medical-records/medical-records.mock';
import { userVeterinarioMock } from 'test/mocks/users/users.mock';
import { appointmentMock } from 'test/mocks/appointments/appointment.mock';
import { petMock } from 'test/mocks/pets/pets.mock';

describe('MedicalRecordsService', () => {
  let service: MedicalRecordsService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicalRecordsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: UsersService, useValue: usersServiceMock },
        { provide: PetsService, useValue: petsServiceMock },
        { provide: AppointmentsService, useValue: appointmentServiceMock },
      ],
    }).compile();

    service = module.get<MedicalRecordsService>(MedicalRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMedicalRecord', () => {
    const vetId = userVeterinarioMock.id;
    const dto = medicalRecordsDtoMock;

    it('should create a medical record', async () => {
      prismaMock.medicalRecords.findFirst.mockResolvedValue(null);
      prismaMock.medicalRecords.create.mockResolvedValue(medicalRecordsMock);
      appointmentServiceMock.getAppointmentById.mockResolvedValue(
        appointmentMock,
      );
      petsServiceMock.getPetById.mockResolvedValue(petMock);
      usersServiceMock.getUserById.mockResolvedValue(userVeterinarioMock);

      const result = await service.createMedicalRecord(vetId, dto);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if appointment is not found', async () => {
      appointmentServiceMock.getAppointmentById.mockResolvedValue(null);
      await expect(service.createMedicalRecord(vetId, dto)).rejects.toThrow(
        'Cita no encontrada',
      );
    });

    it('should throw NotFoundException if pet is not found', async () => {
      appointmentServiceMock.getAppointmentById.mockResolvedValue(
        appointmentMock,
      );
      petsServiceMock.getPetById.mockResolvedValue(null);
      await expect(service.createMedicalRecord(vetId, dto)).rejects.toThrow(
        'Mascota no encontrada',
      );
    });

    it('should throw NotFoundException if vet is not found', async () => {
      appointmentServiceMock.getAppointmentById.mockResolvedValue(
        appointmentMock,
      );
      petsServiceMock.getPetById.mockResolvedValue(petMock);
      usersServiceMock.getUserById.mockResolvedValue(null);
      await expect(service.createMedicalRecord(vetId, dto)).rejects.toThrow(
        'Veterinario no encontrado',
      );
    });

    it('should throw UnauthorizedException if vet is not the owner of the appointment', async () => {
      appointmentServiceMock.getAppointmentById.mockResolvedValue({
        ...appointmentMock,
        vetId: 'otro-vet',
      });
      petsServiceMock.getPetById.mockResolvedValue(petMock);
      usersServiceMock.getUserById.mockResolvedValue(userVeterinarioMock);
      await expect(service.createMedicalRecord(vetId, dto)).rejects.toThrow(
        'Veterinario no autorizado para crear el historial médico',
      );
    });

    it('should throw BadRequestException if medical record already exists', async () => {
      appointmentServiceMock.getAppointmentById.mockResolvedValue(
        appointmentMock,
      );
      petsServiceMock.getPetById.mockResolvedValue(petMock);
      usersServiceMock.getUserById.mockResolvedValue(userVeterinarioMock);
      prismaMock.medicalRecords.findFirst.mockResolvedValue(medicalRecordsMock);
      await expect(service.createMedicalRecord(vetId, dto)).rejects.toThrow(
        'El historial médico ya existe',
      );
    });
  });
  describe('updateMedicalRecord', () => {
    const vetId = userVeterinarioMock.id;
    const dto = {
      id: '1',
      diagnosis: 'Nuevo diagnóstico',
      treatment: 'Nuevo tratamiento',
      notes: 'Nuevas notas',
    };

    it('should update a medical record', async () => {
      const existingRecord = {
        ...medicalRecordsMock,
        vetId,
        diagnosis: 'Viejo diagnóstico',
        treatment: 'Viejo tratamiento',
        notes: 'Viejas notas',
      };

      service['findMedicalRecordById'] = jest
        .fn()
        .mockResolvedValue(existingRecord);
      prismaMock.medicalRecords.update.mockResolvedValue({
        ...existingRecord,
        ...dto,
      });

      await expect(
        service.updateMedicalRecord(vetId, dto),
      ).resolves.toBeUndefined();
      expect(prismaMock.medicalRecords.update).toHaveBeenCalledWith({
        where: { id: dto.id },
        data: {
          diagnosis: dto.diagnosis,
          treatment: dto.treatment,
          notes: dto.notes,
        },
      });
    });

    it('should throw NotFoundException if record does not exist', async () => {
      service['findMedicalRecordById'] = jest.fn().mockResolvedValue(null);

      await expect(service.updateMedicalRecord(vetId, dto)).rejects.toThrow(
        'El historial médico no existe',
      );
    });

    it('should throw UnauthorizedException if vet is not the owner of the record', async () => {
      const recordWithOtherVet = {
        ...medicalRecordsMock,
        vetId: 'otro-vet-id',
      };
      service['findMedicalRecordById'] = jest
        .fn()
        .mockResolvedValue(recordWithOtherVet);

      await expect(service.updateMedicalRecord(vetId, dto)).rejects.toThrow(
        'Veterinario no autorizado para actualizar el historial médico',
      );
    });

    it('should keep existing fields if no updates are provided', async () => {
      const partialDto = { id: '1' }; // Sin diagnosis, treatment, notes
      const record = {
        ...medicalRecordsMock,
        vetId,
        diagnosis: 'Original',
        treatment: 'Original',
        notes: 'Original',
      };

      service['findMedicalRecordById'] = jest.fn().mockResolvedValue(record);
      prismaMock.medicalRecords.update.mockResolvedValue(record);

      await expect(
        service.updateMedicalRecord(vetId, partialDto),
      ).resolves.toBeUndefined();
      expect(prismaMock.medicalRecords.update).toHaveBeenCalledWith({
        where: { id: partialDto.id },
        data: {
          diagnosis: 'Original',
          treatment: 'Original',
          notes: 'Original',
        },
      });
    });
  });
  describe('findMedicalRecordById', () => {
    it('should find a medical record by id', async () => {
      const id = '1';
      const medicalRecord = medicalRecordsMock;
      prismaMock.medicalRecords.findUnique.mockResolvedValue(medicalRecord);
      const result = await service.findMedicalRecordById(id);
      expect(result).toEqual(medicalRecord);
    });
    it('should throw NotFoundException if medical record is not found', async () => {
      const id = '1';
      prismaMock.medicalRecords.findUnique.mockResolvedValue(null);
      const result = await service.findMedicalRecordById(id);
      expect(result).toBeNull();
    });
  });
  describe('findMedicalRecordsByPetId', () => {
    const petId = 'pet-1';

    it('should return medical records mapped to response', async () => {
      petsServiceMock.getPetById.mockResolvedValue({
        id: petId,
        name: 'Firulais',
      });

      const dbRecords = [
        {
          id: 'mr-1',
          petId,
          diagnosis: 'Diagnóstico X',
          treatment: 'Tratamiento Y',
          notes: 'Notas',
          vaccines: [
            {
              id: 'v-1',
              name: 'Rabia',
              description: 'Vacuna rabia',
              date: new Date(),
            },
          ],
          appointment: {
            id: 'app-1',
            vetId: 'vet-1',
            date: new Date(),
            startTime: 500,
            vet: { id: 'vet-1', name: 'Dr. Veterinario' },
          },
        },
      ];

      prismaMock.medicalRecords.findMany.mockResolvedValue(dbRecords);

      const result = await service.findMedicalRecordsByPetId(petId);

      expect(petsServiceMock.getPetById).toHaveBeenCalledWith(petId);
      expect(prismaMock.medicalRecords.findMany).toHaveBeenCalledWith({
        where: { petId },
        include: {
          vaccines: true,
          appointment: { include: { vet: true } },
        },
      });
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('appointmentId', 'app-1');
      expect(result[0]).toHaveProperty('diagnosis', 'Diagnóstico X');
      expect(result[0]).toHaveProperty('vaccines');
      expect(result[0]).toHaveProperty('vetName', 'Dr. Veterinario');
      
    });

    it('should throw NotFoundException if pet does not exist', async () => {
      petsServiceMock.getPetById.mockResolvedValue(null);
      await expect(service.findMedicalRecordsByPetId(petId)).rejects.toThrow(
        'La mascota no existe',
      );
    });

    it('should propagate errors from prisma', async () => {
      petsServiceMock.getPetById.mockResolvedValue({
        id: petId,
        name: 'Firulais',
      });
      prismaMock.medicalRecords.findMany.mockRejectedValue(
        new Error('DB error'),
      );

      await expect(service.findMedicalRecordsByPetId(petId)).rejects.toThrow(
        'DB error',
      );
    });
  });

  describe('updateVaccine', () => {
    const userId = 'vet-123';
    const vaccineId = 'vac-123';
    const dto = { id: vaccineId, name: 'Nueva Vacuna', description: 'Descripción actualizada' };
  
    it('should update vaccine successfully', async () => {
      const vaccineMock = {
        id: vaccineId,
        name: 'Vacuna Vieja',
        description: 'Descripción Vieja',
        medicalRecords: {
          vetId: userId,
        },
      };
  
      prismaMock.vaccines.findUnique.mockResolvedValue(vaccineMock);
      prismaMock.vaccines.update.mockResolvedValue({
        ...vaccineMock,
        name: dto.name,
        description: dto.description,
      });
  
      await expect(service.updateVaccine(userId, dto)).resolves.toBeUndefined();
      expect(prismaMock.vaccines.findUnique).toHaveBeenCalledWith({
        where: { id: vaccineId },
        include: { medicalRecords: true },
      });
      expect(prismaMock.vaccines.update).toHaveBeenCalledWith({
        where: { id: vaccineId },
        data: { name: dto.name, description: dto.description },
      });
    });
  
    it('should throw NotFoundException if vaccine does not exist', async () => {
      prismaMock.vaccines.findUnique.mockResolvedValue(null);
      await expect(service.updateVaccine(userId, dto)).rejects.toThrow('La vacuna no existe');
    });
  
    it('should throw UnauthorizedException if vet is not owner of vaccine', async () => {
      const vaccineMock = {
        id: vaccineId,
        name: 'Vacuna Vieja',
        description: 'Descripción Vieja',
        medicalRecords: {
          vetId: 'otro-vet',
        },
      };
      prismaMock.vaccines.findUnique.mockResolvedValue(vaccineMock);
      await expect(service.updateVaccine(userId, dto)).rejects.toThrow('Veterinario no autorizado para actualizar la vacuna');
    });
  
    it('should keep existing name and description if not provided', async () => {
      const vaccineMock = {
        id: vaccineId,
        name: 'Vacuna Vieja',
        description: 'Descripción Vieja',
        medicalRecords: {
          vetId: userId,
        },
      };
      prismaMock.vaccines.findUnique.mockResolvedValue(vaccineMock);
      prismaMock.vaccines.update.mockResolvedValue(vaccineMock);
  
      const partialDto = { id: vaccineId }; // sin name ni description
  
      await expect(service.updateVaccine(userId, partialDto)).resolves.toBeUndefined();
      expect(prismaMock.vaccines.update).toHaveBeenCalledWith({
        where: { id: vaccineId },
        data: { name: 'Vacuna Vieja', description: 'Descripción Vieja' },
      });
    });
  });
  describe('deleteVaccine', () => {
    const userId = 'vet-123';
    const vaccineId = 'vac-123';
  
    it('should delete vaccine successfully', async () => {
      const vaccineMock = {
        id: vaccineId,
        medicalRecords: {
          vetId: userId,
        },
      };
  
      prismaMock.vaccines.findUnique.mockResolvedValue(vaccineMock);
      prismaMock.vaccines.delete.mockResolvedValue(vaccineMock);
  
      await expect(service.deleteVaccine(userId, vaccineId)).resolves.toBeUndefined();
  
      expect(prismaMock.vaccines.findUnique).toHaveBeenCalledWith({
        where: { id: vaccineId },
        include: { medicalRecords: true },
      });
      expect(prismaMock.vaccines.delete).toHaveBeenCalledWith({
        where: { id: vaccineId },
      });
    });
  
    it('should throw NotFoundException if vaccine does not exist', async () => {
      prismaMock.vaccines.findUnique.mockResolvedValue(null);
      await expect(service.deleteVaccine(userId, vaccineId)).rejects.toThrow('La vacuna no existe');
    });
  
    it('should throw UnauthorizedException if vet is not owner of vaccine', async () => {
      const vaccineMock = {
        id: vaccineId,
        medicalRecords: {
          vetId: 'otro-vet',
        },
      };
      prismaMock.vaccines.findUnique.mockResolvedValue(vaccineMock);
      await expect(service.deleteVaccine(userId, vaccineId)).rejects.toThrow('Veterinario no autorizado para eliminar la vacuna');
    });
  
    it('should throw NotFoundException if delete returns null', async () => {
      const vaccineMock = {
        id: vaccineId,
        medicalRecords: {
          vetId: userId,
        },
      };
      prismaMock.vaccines.findUnique.mockResolvedValue(vaccineMock);
      prismaMock.vaccines.delete.mockResolvedValue(null);
  
      await expect(service.deleteVaccine(userId, vaccineId)).rejects.toThrow('La vacuna no existe');
    });
  });
  
});
