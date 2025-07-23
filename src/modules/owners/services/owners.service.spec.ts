import { Test, TestingModule } from '@nestjs/testing';
import { OwnersService } from './owners.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { prismaMock } from 'test/mocks/prisma.mock';
import { ownerMock, ownerCreateDto, metaQueryDtoMock, ownerUpdateDto } from 'test/mocks/owners.mock';
import { ownerToResponseWithPets } from 'src/common/mappers/owner.mappers';

describe('OwnersService', () => {
  let service: OwnersService;

  beforeEach(async () => {
    jest.resetAllMocks(); 
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OwnersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<OwnersService>(OwnersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOwner', () => {
    it('should create an owner', async () => {
      prismaMock.owner.create.mockResolvedValue(ownerMock);
      const result = await service.createOwner(ownerCreateDto);
      expect(result.dni).toEqual(ownerCreateDto.dni);
      expect(result.name).toEqual(ownerCreateDto.name);
      expect(result.lastname).toEqual(ownerCreateDto.lastname);
      expect(result.email).toEqual(ownerCreateDto.email);
      expect(result.phone).toEqual(ownerCreateDto.phone);
      expect(result.address).toEqual(ownerCreateDto.address);
    });

    it('should throw an error if the owner already exists', async () => {
      prismaMock.owner.findUnique.mockResolvedValue(ownerMock);
      await expect(service.createOwner(ownerCreateDto)).rejects.toThrow(
        'El dni ingresado ya está registrado.',
      );
      expect(prismaMock.owner.findUnique).toHaveBeenCalledWith({
        where: { dni: ownerCreateDto.dni },
      });
    });

    it('should throw an error if the phone already exists', async () => {
      prismaMock.owner.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(ownerMock);
      await expect(service.createOwner(ownerCreateDto)).rejects.toThrow(
        'El teléfono ingresado ya está registrado.',
      );
      expect(prismaMock.owner.findUnique).toHaveBeenCalledWith({
        where: { dni: ownerCreateDto.dni },
      });
      expect(prismaMock.owner.findUnique).toHaveBeenCalledWith({
        where: { phone: ownerCreateDto.phone },
      });
    });
  });

  describe('searchOwners', () => {
    it('should search and return paginated owners', async () => {
      prismaMock.owner.findMany.mockResolvedValue([ownerMock]);
      prismaMock.owner.count.mockResolvedValue(1);
  
      const result = await service.searchOwners(metaQueryDtoMock);
  
      // Como no mockeamos el mapper, usamos directamente el resultado mapeado:
      const expectedData = [ownerToResponseWithPets(ownerMock, ownerMock.pets)];
  
      expect(result.data).toEqual(expectedData);
  
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        size: 10,
        sort: 'asc',
      });
  
      expect(prismaMock.owner.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: expect.arrayContaining([
              { name: { contains: 'rafa' } },
              { lastname: { contains: 'rafa' } },
              { email: { contains: 'rafa' } },
              { phone: { contains: 'rafa' } },
              { dni: { contains: 'rafa' } },
            ]),
          },
          skip: 0,
          take: 10,
          orderBy: { createdAt: 'asc' },
          include: { pets: true },
        }),
      );
  
      expect(prismaMock.owner.count).toHaveBeenCalledWith(
        expect.any(Object),
      );
    });
  });
  
  describe('updateOwner', () => {
    const ownerToUpdate = ownerMock
    const updateDto = ownerUpdateDto;
  
    it('should update owner successfully', async () => {
      prismaMock.owner.findUnique
        .mockResolvedValueOnce(ownerToUpdate) 
        .mockResolvedValueOnce(null) 
        .mockResolvedValueOnce(null); 
  
      prismaMock.owner.update.mockResolvedValue({
        ...ownerToUpdate,
        ...updateDto,
      });
  
      const result = await service.updateOwner(updateDto);
  
      expect(result.dni).toBe(updateDto.dni);
      expect(result.phone).toBe(updateDto.phone);
      expect(result.name).toBe(updateDto.name);
    });

    it('should throw if owner does not exist', async () => {
      prismaMock.owner.findUnique.mockResolvedValue(null);
  
      await expect(service.updateOwner(updateDto)).rejects.toThrow(
        'El dueño no existe.',
      );
    }); 
  
    it('should throw if dni is already taken by another owner', async () => {
      prismaMock.owner.findUnique
        .mockResolvedValueOnce(ownerToUpdate) 
        .mockResolvedValueOnce({ id: '2' }); 
  
      await expect(service.updateOwner(updateDto)).rejects.toThrow(
        'El dni ingresado ya está registrado.',
      );
    });
  
    it('should throw if phone is already taken by another owner', async () => {
      prismaMock.owner.findUnique
        .mockResolvedValueOnce(ownerToUpdate)
        .mockResolvedValueOnce(null) 
        .mockResolvedValueOnce({ id: '2' }); 
  
      await expect(service.updateOwner(updateDto)).rejects.toThrow(
        'El teléfono ingresado ya está registrado.',
      );
    });
  
    it('should update ignoring undefined fields', async () => {
      const partialUpdateDto = {
        id: '1',
        name: 'Rafaelito',
      };
  
      prismaMock.owner.findUnique
        .mockResolvedValueOnce(ownerToUpdate) 
        .mockResolvedValueOnce(null) 
        .mockResolvedValueOnce(null); 
  
      prismaMock.owner.update.mockResolvedValue({
        ...ownerToUpdate,
        ...partialUpdateDto,
      });
  
      const result = await service.updateOwner(partialUpdateDto);
  
      expect(result.name).toBe('Rafaelito');
      expect(result.dni).toBe(ownerToUpdate.dni);
    });
  });

  describe('deleteOwner', () => {
    it('should delete an owner', async () => {
      prismaMock.owner.findUnique.mockResolvedValue(ownerMock.id);
      prismaMock.owner.delete.mockResolvedValue(ownerMock);
      await service.deleteOwner(ownerMock.id);
  
      expect(prismaMock.owner.findUnique).toHaveBeenCalledWith({
        where: { id: ownerMock.id },
      });
      expect(prismaMock.owner.delete).toHaveBeenCalledWith({
        where: { id: ownerMock.id },
      });
    });
    
  
    it('should throw if owner does not exist', async () => {
      prismaMock.owner.findUnique.mockResolvedValue(null);
  
      await expect(service.deleteOwner(ownerMock.id)).rejects.toThrow(
        'El dueño no existe.',
      );
    });
  });

  describe('findOwnerById', () => {
    it('should find an owner by id', async () => {
      prismaMock.owner.findUnique.mockResolvedValue(ownerMock);
      const result = await service.findOwnerById(ownerMock.id);
      expect(result?.id).toEqual(ownerMock.id);
    });

    it('should return null if owner does not exist', async () => {
      prismaMock.owner.findUnique.mockResolvedValue(null);
      
      const result = await service.findOwnerById(ownerMock.id);
      expect(result).toBeNull();
    });
  });

  describe('findOwnerByDni', () => {
    it('should find an owner by dni', async () => {
      prismaMock.owner.findUnique.mockResolvedValue(ownerMock);
      const result = await service.findOwnerByDni(ownerMock.dni);
      expect(result?.dni).toEqual(ownerMock.dni);
    });

    it('should return null if owner does not exist', async () => {
      prismaMock.owner.findUnique.mockResolvedValue(null);
      const result = await service.findOwnerByDni(ownerMock.dni);
      expect(result).toBeNull();
    });
  });

  describe('findOwnerByPhone', () => {
    it('should find an owner by phone', async () => {
      prismaMock.owner.findUnique.mockResolvedValue(ownerMock);
      const result = await service.findOwnerByPhone(ownerMock.phone);
      expect(result?.phone).toEqual(ownerMock.phone);
    });

    it('should return null if owner does not exist', async () => {
      prismaMock.owner.findUnique.mockResolvedValue(null);
      const result = await service.findOwnerByPhone(ownerMock.phone);
      expect(result).toBeNull();
    });
  });
});
