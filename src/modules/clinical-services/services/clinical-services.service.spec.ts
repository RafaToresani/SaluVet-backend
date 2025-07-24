import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalServicesService } from './clinical-services.service';
import { prismaMock } from 'test/mocks/prisma.mock';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { clinicalServiceMock, createClinicalServiceDtoMock, updateClinicalServiceDtoMock, userClinicalServiceMock } from 'test/mocks/clinical-services/clinical-services.mock';
import { clinicalServiceToClinicalServiceResponse } from 'src/common/mappers/clinical-service.mappers';

describe('ClinicalServicesService', () => {
  let service: ClinicalServicesService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClinicalServicesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ClinicalServicesService>(ClinicalServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createClinicalService', () => {
    it('should create a clinical service', async () => {
      prismaMock.clinicalService.findUnique.mockResolvedValueOnce(null); // Para getClinicalServiceByName
      prismaMock.clinicalService.create.mockResolvedValue(clinicalServiceMock);
      prismaMock.clinicalService.findUnique.mockResolvedValueOnce(clinicalServiceMock); // Para getClinicalServiceById
      prismaMock.user.findMany.mockResolvedValue([]); // No importa, pero lo necesita
      prismaMock.userClinicalService.createMany.mockResolvedValue({ count: 0 });
  
      const result = await service.createClinicalService(createClinicalServiceDtoMock);
  
      expect(result.name).toEqual(createClinicalServiceDtoMock.name);
      expect(result.description).toEqual(createClinicalServiceDtoMock.description);
      expect(result.price).toEqual(createClinicalServiceDtoMock.price);
      expect(result.duration).toEqual(createClinicalServiceDtoMock.duration);
      expect(result.isActive).toEqual(createClinicalServiceDtoMock.isActive);
    });
  
    it('should throw an error if the service already exists', async () => {
      prismaMock.clinicalService.findUnique.mockResolvedValue(clinicalServiceMock); // Simula que ya existe
  
      await expect(service.createClinicalService(createClinicalServiceDtoMock))
        .rejects
        .toThrow('El servicio ya existe');
    });
  });

  describe('getAllClinicalServices', () => {
    it('should return all clinical services', async () => {
      prismaMock.clinicalService.findMany.mockResolvedValue([clinicalServiceMock]);
      const result = await service.getAllClinicalServices();
      expect(result).toEqual([clinicalServiceToClinicalServiceResponse(clinicalServiceMock)]);
    });
  });

  describe('getClinicalServiceByName', () => {
    it('should return a clinical service by name', async () => {
      prismaMock.clinicalService.findUnique.mockResolvedValue(clinicalServiceMock);
      const result = await service.getClinicalServiceByName(clinicalServiceMock.name);
      expect(result?.id).toEqual(clinicalServiceMock.id);
      expect(result?.name).toEqual(clinicalServiceMock.name);
      expect(result?.description).toEqual(clinicalServiceMock.description);
      expect(result?.price).toEqual(clinicalServiceMock.price);
      expect(result?.duration).toEqual(clinicalServiceMock.duration);
      expect(result?.isActive).toEqual(clinicalServiceMock.isActive);
    });

    it('should return null if the clinical service does not exist', async () => {
      prismaMock.clinicalService.findUnique.mockResolvedValue(null);
      const result = await service.getClinicalServiceByName(clinicalServiceMock.name);
      expect(result).toBeNull();
    });
  });

  describe('updateClinicalService', () => {
    it('should update the clinical service correctly', async () => {
      prismaMock.clinicalService.findUnique
        .mockResolvedValueOnce(clinicalServiceMock) // getClinicalServiceById
        .mockResolvedValueOnce(null); // getClinicalServiceByName
  
      prismaMock.clinicalService.update.mockResolvedValue({
        ...clinicalServiceMock,
        ...updateClinicalServiceDtoMock,
      });
  
      const result = await service.updateClinicalService(updateClinicalServiceDtoMock);
  
      expect(result.name).toEqual(updateClinicalServiceDtoMock.name);
      expect(result.price).toEqual(updateClinicalServiceDtoMock.price);
      expect(result.duration).toEqual(updateClinicalServiceDtoMock.duration);
      expect(result.description).toEqual(updateClinicalServiceDtoMock.description);
      expect(result.isActive).toEqual(updateClinicalServiceDtoMock.isActive);
    });
  
    it('should throw if service does not exist', async () => {
      prismaMock.clinicalService.findUnique.mockResolvedValue(null); // getClinicalServiceById
  
      await expect(service.updateClinicalService(updateClinicalServiceDtoMock))
        .rejects
        .toThrow('El servicio no existe');
    });
  
    it('should throw if service name is already taken by another', async () => {
      prismaMock.clinicalService.findUnique
        .mockResolvedValueOnce(clinicalServiceMock) // getClinicalServiceById
        .mockResolvedValueOnce({ ...clinicalServiceMock, id: 'otro-id' }); // getClinicalServiceByName
  
      await expect(service.updateClinicalService(updateClinicalServiceDtoMock))
        .rejects
        .toThrow('El nombre del servicio no está disponible');
    });
  });
  
  describe('deleteClinicalService', () => {
    it('should delete the clinical service correctly', async () => {
      prismaMock.clinicalService.findUnique.mockResolvedValue(clinicalServiceMock);
      prismaMock.clinicalService.delete.mockResolvedValue(clinicalServiceMock);
      await service.deleteClinicalService(clinicalServiceMock.id);
      expect(prismaMock.clinicalService.delete).toHaveBeenCalledWith({ where: { id: clinicalServiceMock.id } });
    });

    it('should throw if service does not exist', async () => {
      prismaMock.clinicalService.findUnique.mockResolvedValue(null);
      await expect(service.deleteClinicalService(clinicalServiceMock.id))
        .rejects
        .toThrow('El servicio no existe');
    });
  });

  describe('getClinicalServiceById', () => {
    it('should return a clinical service by id', async () => {
      prismaMock.clinicalService.findUnique.mockResolvedValue(clinicalServiceMock);
      const result = await service.getClinicalServiceById(clinicalServiceMock.id);
      expect(result).toEqual(clinicalServiceMock);
    });

    it('should return null if the clinical service does not exist', async () => {
      prismaMock.clinicalService.findUnique.mockResolvedValue(null);
      const result = await service.getClinicalServiceById(clinicalServiceMock.id);
      expect(result).toBeNull();
    });
  });

  describe('toggleUserClinicalService', () => {
    it('should toggle the user clinical service correctly', async () => {
      prismaMock.userClinicalService.findUnique.mockResolvedValue(userClinicalServiceMock);
  
      const updatedMock = {
        ...userClinicalServiceMock,
        isActive: !userClinicalServiceMock.isActive,
      };
      prismaMock.userClinicalService.update.mockResolvedValue(updatedMock);
  
      const result = await service.toggleUserClinicalService(
        userClinicalServiceMock.userId,
        userClinicalServiceMock.clinicalServiceId,
      );
  
      expect(result).toEqual(updatedMock);
      expect(result.isActive).toEqual(!userClinicalServiceMock.isActive);
    });
  
    it('should throw if user clinical service does not exist', async () => {
      prismaMock.userClinicalService.findUnique.mockResolvedValue(null);
  
      await expect(
        service.toggleUserClinicalService(
          userClinicalServiceMock.userId,
          userClinicalServiceMock.clinicalServiceId,
        ),
      ).rejects.toThrow('El veterinario no tiene habilitado este servicio');
    });
  });

  describe('validateUserCanPerformServices', () => {
    const userId = '1';
    const serviceIds = ['service-1', 'service-2'];
  
    it('should validate all services successfully if enabled', async () => {
      prismaMock.userClinicalService.findUnique.mockResolvedValue({
        ...userClinicalServiceMock,
        isActive: true,
      });
  
      await expect(
        service.validateUserCanPerformServices(userId, serviceIds),
      ).resolves.toBeUndefined();
  
      expect(prismaMock.userClinicalService.findUnique).toHaveBeenCalledTimes(2);
    });
  
    it('should throw if a service is not assigned or inactive', async () => {
      prismaMock.userClinicalService.findUnique.mockImplementation(({ where }) => {
        if (where.userId_clinicalServiceId.clinicalServiceId === 'service-2') {
          return Promise.resolve(null); // simulamos que no existe
        }
        return Promise.resolve({ ...userClinicalServiceMock, isActive: true });
      });
  
      await expect(
        service.validateUserCanPerformServices(userId, serviceIds),
      ).rejects.toThrow(
        'El veterinario no tiene habilitado el servicio con id service-2',
      );
    });
  
    it('should throw if a service is inactive', async () => {
      prismaMock.userClinicalService.findUnique.mockResolvedValueOnce({
        ...userClinicalServiceMock,
        isActive: false,
      });
  
      await expect(
        service.validateUserCanPerformServices(userId, ['inactive-service']),
      ).rejects.toThrow(
        'El veterinario no tiene habilitado el servicio con id inactive-service',
      );
    });
  });
  
  describe('count', () => {
    it('should return the number of clinical services', async () => {
      prismaMock.clinicalService.count.mockResolvedValue(1);
      const result = await service.count();
      expect(result).toEqual(1);
    });
  });

  describe('bulkCreate', () => {
    it('should create multiple clinical services', async () => {
      prismaMock.clinicalService.createMany.mockResolvedValue({ count: 1 });
  
      await service.bulkCreate([createClinicalServiceDtoMock]);
  
      expect(prismaMock.clinicalService.createMany).toHaveBeenCalledWith({
        data: [createClinicalServiceDtoMock],
      });
    });
  });
  describe('initializeUserClinicalServices', () => {
    const userId = 'user-id-1';
  
    it('should throw if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
  
      await expect(service.initializeUserClinicalServices(userId)).rejects.toThrow('El usuario no existe');
    });
  
    it('should create user-clinicalService relations for active services', async () => {
      const clinicalServices = [
        { id: 'cs1', isActive: true },
        { id: 'cs2', isActive: true },
      ];
  
      prismaMock.user.findUnique.mockResolvedValue({ id: userId });
      prismaMock.clinicalService.findMany.mockResolvedValue(clinicalServices);
      prismaMock.userClinicalService.createMany.mockResolvedValue({ count: 2 });
  
      await service.initializeUserClinicalServices(userId);
  
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect(prismaMock.clinicalService.findMany).toHaveBeenCalledWith({ where: { isActive: true } });
      expect(prismaMock.userClinicalService.createMany).toHaveBeenCalledWith({
        data: [
          { userId, clinicalServiceId: 'cs1', isActive: false },
          { userId, clinicalServiceId: 'cs2', isActive: false },
        ],
        skipDuplicates: true,
      });
    });
  });
  describe('initializeClinicalServiceUser', () => {
    const clinicalServiceId = 'cs1';
  
    it('should throw if clinical service does not exist', async () => {
      jest.spyOn(service, 'getClinicalServiceById').mockResolvedValue(null);
  
      await expect(service.initializeClinicalServiceUser(clinicalServiceId)).rejects.toThrow('El servicio no existe');
    });
  
    it('should create user-clinicalService relations for veterinarians', async () => {
      jest.spyOn(service, 'getClinicalServiceById').mockResolvedValue(clinicalServiceMock);
  
      const users = [
        { id: 'vet1', role: 'VETERINARIO' },
        { id: 'vet2', role: 'VETERINARIO' },
      ];
  
      prismaMock.user.findMany.mockResolvedValue(users);
      prismaMock.userClinicalService.createMany.mockResolvedValue({ count: 2 });
  
      await service.initializeClinicalServiceUser(clinicalServiceId);
  
      expect(service.getClinicalServiceById).toHaveBeenCalledWith(clinicalServiceId);
      expect(prismaMock.user.findMany).toHaveBeenCalledWith({ where: { role: 'VETERINARIO' } });
      expect(prismaMock.userClinicalService.createMany).toHaveBeenCalledWith({
        data: [
          { userId: 'vet1', clinicalServiceId, isActive: false },
          { userId: 'vet2', clinicalServiceId, isActive: false },
        ],
        skipDuplicates: true,
      });
    });
  });
  
});
