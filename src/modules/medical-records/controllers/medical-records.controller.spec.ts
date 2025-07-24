import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRecordsController } from './medical-records.controller';
import { MedicalRecordsService } from '../services/medical-records.service';
import { medicalRecordsServiceMock } from 'test/mocks/medical-records/medical-records.service.mock';
import { medicalRecordsDtoMock, medicalRecordsMock } from 'test/mocks/medical-records/medical-records.mock';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MedicalRecordForUpdateDto } from '../dtos/medicalRecordForUpdateDto.dto';
import { VaccineForUpdateDto } from '../dtos/vaccineForUpdateDto.dto';

describe('MedicalRecordsController', () => {
  let controller: MedicalRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalRecordsController],
      providers: [
        {
          provide: MedicalRecordsService,
          useValue: medicalRecordsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<MedicalRecordsController>(MedicalRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createMedicalRecord', () => {
    it('should call service to create a medical record', async () => {
      const userId = '1';
      const dto = medicalRecordsDtoMock;
  
      medicalRecordsServiceMock.createMedicalRecord.mockResolvedValue(undefined);
  
      const result = await controller.createMedicalRecord(userId, dto);
  
      expect(medicalRecordsServiceMock.createMedicalRecord).toHaveBeenCalledWith(userId, dto);
      expect(result).toBeUndefined(); 
    });
  });
  describe('findMedicalRecordsByPetId', () => {
    const petId = 'pet-1';
    const userId = 'user-1';
  
    it('should return medical records for the pet', async () => {
      const expectedRecords = [medicalRecordsMock];
      medicalRecordsServiceMock.findMedicalRecordsByPetId.mockResolvedValue(expectedRecords);
  
      const result = await controller.findMedicalRecordsByPetId(userId, petId);
  
      expect(result).toEqual(expectedRecords);
      expect(medicalRecordsServiceMock.findMedicalRecordsByPetId).toHaveBeenCalledWith(petId);
    });
  
    it('should throw an error if service fails', async () => {
      medicalRecordsServiceMock.findMedicalRecordsByPetId.mockRejectedValue(
        new NotFoundException('La mascota no existe'),
      );
  
      await expect(controller.findMedicalRecordsByPetId(userId, petId)).rejects.toThrow('La mascota no existe');
      expect(medicalRecordsServiceMock.findMedicalRecordsByPetId).toHaveBeenCalledWith(petId);
    });
  });
  describe('updateMedicalRecord', () => {
    const userId = 'vet-1';
    const dto: MedicalRecordForUpdateDto = {
      id: 'mr-1',
      diagnosis: 'Nuevo diagnóstico',
      treatment: 'Nuevo tratamiento',
      notes: 'Nuevas notas',
    };
  
    it('should update a medical record successfully', async () => {
      medicalRecordsServiceMock.updateMedicalRecord.mockResolvedValue(undefined);
  
      const result = await controller.updateMedicalRecord(userId, dto);
  
      expect(result).toBeUndefined();
      expect(medicalRecordsServiceMock.updateMedicalRecord).toHaveBeenCalledWith(userId, dto);
    });
  
    it('should throw an error if the update fails', async () => {
      medicalRecordsServiceMock.updateMedicalRecord.mockRejectedValue(
        new UnauthorizedException('Veterinario no autorizado para actualizar el historial médico'),
      );
  
      await expect(controller.updateMedicalRecord(userId, dto)).rejects.toThrow(
        'Veterinario no autorizado para actualizar el historial médico',
      );
      expect(medicalRecordsServiceMock.updateMedicalRecord).toHaveBeenCalledWith(userId, dto);
    });
  });
  describe('updateVaccine', () => {
    const userId = 'vet-1';
    const dto: VaccineForUpdateDto = {
      id: 'vaccine-1',
      name: 'Vacuna Actualizada',
      description: 'Descripción actualizada',
    };
  
    it('should update a vaccine successfully', async () => {
      medicalRecordsServiceMock.updateVaccine.mockResolvedValue(undefined);
  
      const result = await controller.updateVaccine(userId, dto);
  
      expect(result).toBeUndefined();
      expect(medicalRecordsServiceMock.updateVaccine).toHaveBeenCalledWith(userId, dto);
    });
  
    it('should throw an error if update fails', async () => {
      medicalRecordsServiceMock.updateVaccine.mockRejectedValue(
        new UnauthorizedException('Veterinario no autorizado para actualizar la vacuna'),
      );
  
      await expect(controller.updateVaccine(userId, dto)).rejects.toThrow(
        'Veterinario no autorizado para actualizar la vacuna',
      );
      expect(medicalRecordsServiceMock.updateVaccine).toHaveBeenCalledWith(userId, dto);
    });
  });
  describe('deleteVaccine', () => {
    const userId = 'vet-1';
    const vaccineId = 'vaccine-1';
  
    it('should delete a vaccine successfully', async () => {
      medicalRecordsServiceMock.deleteVaccine.mockResolvedValue(undefined);
  
      const result = await controller.deleteVaccine(userId, vaccineId);
  
      expect(result).toBeUndefined();
      expect(medicalRecordsServiceMock.deleteVaccine).toHaveBeenCalledWith(userId, vaccineId);
    });
  
    it('should throw an error if deletion fails', async () => {
      medicalRecordsServiceMock.deleteVaccine.mockRejectedValue(
        new NotFoundException('La vacuna no existe'),
      );
  
      await expect(controller.deleteVaccine(userId, vaccineId)).rejects.toThrow('La vacuna no existe');
      expect(medicalRecordsServiceMock.deleteVaccine).toHaveBeenCalledWith(userId, vaccineId);
    });
  });
  
});
