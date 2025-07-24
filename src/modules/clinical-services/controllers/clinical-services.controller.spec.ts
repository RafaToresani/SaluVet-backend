import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalServicesController } from './clinical-services.controller';
import { ClinicalServicesService } from '../services/clinical-services.service';
import { clinicalServicesServiceMock } from 'test/mocks/clinical-services/clinical-services.service.mock';
import { clinicalServiceMock, createClinicalServiceDtoMock, updateClinicalServiceDtoMock, userClinicalServiceMock } from 'test/mocks/clinical-services/clinical-services.mock';
import { clinicalServiceToClinicalServiceResponse } from 'src/common/mappers/clinical-service.mappers';
import { BadRequestException } from '@nestjs/common';

describe('ClinicalServicesController', () => {
  let controller: ClinicalServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicalServicesController],
      providers: [
        {
          provide: ClinicalServicesService,
          useValue: clinicalServicesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ClinicalServicesController>(
      ClinicalServicesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createClinicalService', () => {
    it('should create a clinical service', async () => {
      clinicalServicesServiceMock.createClinicalService.mockResolvedValue(clinicalServiceMock);
  
      const result = await controller.createClinicalService(createClinicalServiceDtoMock);
  
      expect(clinicalServicesServiceMock.createClinicalService).toHaveBeenCalledWith(createClinicalServiceDtoMock);
      expect(result).toEqual(clinicalServiceMock);
    });
  
    it('should throw BadRequestException if the clinical service already exists', async () => {
      clinicalServicesServiceMock.createClinicalService.mockRejectedValue(new BadRequestException('El servicio ya existe'));
  
      await expect(controller.createClinicalService(createClinicalServiceDtoMock)).rejects.toThrow(BadRequestException);
      expect(clinicalServicesServiceMock.createClinicalService).toHaveBeenCalledWith(createClinicalServiceDtoMock);
    });
  });
  

  describe('getAllClinicalServices', () => {
    it('should return all clinical services', async () => {
      clinicalServicesServiceMock.getAllClinicalServices.mockResolvedValue([clinicalServiceMock]);
      const result = await controller.getAllClinicalServices();
      expect(result).toEqual([clinicalServiceMock]);
    });
  });

  describe('updateClinicalService', () => {
    it('should update a clinical service', async () => {
      clinicalServicesServiceMock.updateClinicalService.mockResolvedValue(clinicalServiceMock);
      const result = await controller.updateClinicalService(updateClinicalServiceDtoMock);
      expect(clinicalServicesServiceMock.updateClinicalService).toHaveBeenCalledWith(updateClinicalServiceDtoMock);
      expect(result).toEqual(clinicalServiceMock);
    });

    it('should throw BadRequestException if the clinical service does not exist', async () => {
      clinicalServicesServiceMock.updateClinicalService.mockRejectedValue(new BadRequestException('El servicio no existe'));
      await expect(controller.updateClinicalService(updateClinicalServiceDtoMock)).rejects.toThrow(BadRequestException);
      expect(clinicalServicesServiceMock.updateClinicalService).toHaveBeenCalledWith(updateClinicalServiceDtoMock);
    });
  });

  describe('deleteClinicalService', () => {
    it('should delete a clinical service', async () => {
      clinicalServicesServiceMock.deleteClinicalService.mockResolvedValue(clinicalServiceMock);
      const result = await controller.deleteClinicalService(clinicalServiceMock.id);
      expect(clinicalServicesServiceMock.deleteClinicalService).toHaveBeenCalledWith(clinicalServiceMock.id);
      expect(result).toEqual(clinicalServiceMock);
    });

    it('should throw BadRequestException if the clinical service does not exist', async () => {
      clinicalServicesServiceMock.deleteClinicalService.mockRejectedValue(new BadRequestException('El servicio no existe'));
      await expect(controller.deleteClinicalService(clinicalServiceMock.id)).rejects.toThrow(BadRequestException);
      expect(clinicalServicesServiceMock.deleteClinicalService).toHaveBeenCalledWith(clinicalServiceMock.id);
    });
  });

  describe('toggleUserClinicalService', () => {
    it('should toggle a user clinical service', async () => {
      clinicalServicesServiceMock.toggleUserClinicalService.mockResolvedValue(clinicalServiceMock);
      const result = await controller.toggleUserClinicalService(userClinicalServiceMock.userId, userClinicalServiceMock.clinicalServiceId);
      expect(clinicalServicesServiceMock.toggleUserClinicalService).toHaveBeenCalledWith(userClinicalServiceMock.userId, userClinicalServiceMock.clinicalServiceId);
      expect(result).toEqual(clinicalServiceMock);
    });

    it('should throw BadRequestException if the user clinical service does not exist', async () => {
      clinicalServicesServiceMock.toggleUserClinicalService.mockRejectedValue(new BadRequestException('El veterinario no tiene habilitado este servicio'));
      await expect(controller.toggleUserClinicalService(userClinicalServiceMock.userId, userClinicalServiceMock.clinicalServiceId)).rejects.toThrow(BadRequestException);
      expect(clinicalServicesServiceMock.toggleUserClinicalService).toHaveBeenCalledWith(userClinicalServiceMock.userId, userClinicalServiceMock.clinicalServiceId);
    });
  });
});
