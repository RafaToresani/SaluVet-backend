import { Test, TestingModule } from '@nestjs/testing';
import { PetsService } from './pets.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PetForCreationDto } from '../dtos/petForCreationDto.dto';
import { EPetGender, EPetSpecies, Pet } from 'generated/prisma';
import { BadRequestException } from '@nestjs/common';
import {
  MetaQueryDto,
  SortOrder,
} from 'src/common/utils/pagination/metaQueryDto.dto';
import { PetForUpdateDto } from '../dtos/petForUpdateDto.dto';

describe('PetsService', () => {
  let service: PetsService;
  let prismaMock: {
    pet: {
      create: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
    owner: {
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaMock = {
      pet: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      owner: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<PetsService>(PetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPet', () => {
    let createPetDto: PetForCreationDto = {
      ownerId: '1',
      name: 'Buddy',
      birthdate: new Date('2020-01-01'),
      species: EPetSpecies.PERRO,
      breed: 'Labrador',
      gender: EPetGender.MACHO,
    };

    const ownerDoesNotExistMessage = 'El dueño no existe';
    const petWithNameAlreadyExistsMessage =
      'El dueño ya tiene un mascota con ese nombre';
    const birthdateInFutureMessage =
      'La fecha de nacimiento no puede ser en el futuro';

    function mockOwnerExists() {
      prismaMock.owner.findUnique.mockResolvedValue({
        id: '1',
        name: 'Rafa',
      });
    }

    function mockOwnerDoesNotExist() {
      prismaMock.owner.findUnique.mockResolvedValue(null);
    }

    function mockNoPetWithName(name: string, id: string) {
      prismaMock.pet.findFirst.mockResolvedValue(null);
    }

    function mockPetWithName(name: string, id: string) {
      prismaMock.pet.findFirst.mockResolvedValue({
        id: '123',
        ...createPetDto,
        owner: { id: '1', name: 'Rafa' },
      });
    }

    it('should create a pet', async () => {
      mockOwnerExists();
      mockNoPetWithName(createPetDto.name, createPetDto.ownerId);

      prismaMock.pet.create.mockResolvedValue({
        id: '123',
        ...createPetDto,
        owner: { id: '1', name: 'Rafa' },
      });

      const pet = await service.createPet(createPetDto);

      expect(pet).toBeDefined();
      expect(pet.name).toBe(createPetDto.name);
      expect(pet.birthdate).toBe(createPetDto.birthdate);
      expect(pet.species).toBe(createPetDto.species);
      expect(pet.breed).toBe(createPetDto.breed);
      expect(pet.gender).toBe(createPetDto.gender);
      expect(pet.id).toBeDefined();
    });

    it('should thow BadRequest if owner does not exist', async () => {
      mockOwnerDoesNotExist();

      await expect(service.createPet(createPetDto)).rejects.toThrow(
        BadRequestException,
      );

      await expect(service.createPet(createPetDto)).rejects.toThrow(
        ownerDoesNotExistMessage,
      );
    });

    it('should thow BadRequest if pet with name already exists', async () => {
      mockOwnerExists();
      mockPetWithName(createPetDto.name, createPetDto.ownerId);

      await expect(service.createPet(createPetDto)).rejects.toThrow(
        BadRequestException,
      );

      await expect(service.createPet(createPetDto)).rejects.toThrow(
        petWithNameAlreadyExistsMessage,
      );
    });

    it('should thow BadRequest if birthdate is in the future', async () => {
      mockOwnerExists();
      mockNoPetWithName(createPetDto.name, createPetDto.ownerId);
      createPetDto.birthdate = new Date('2029-01-01');

      await expect(service.createPet(createPetDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getPetById', () => {
    const petMock = {
      id: '123',
      name: 'Buddy',
      birthdate: new Date('2020-01-01'),
      species: EPetSpecies.PERRO,
      breed: 'Labrador',
      gender: EPetGender.MACHO,
    };
    it('should get a pet by id', async () => {
      const petid = petMock.id;
      prismaMock.pet.findUnique.mockResolvedValue(petMock);

      const result: Pet | null = await service.getPetById(petid);

      expect(result).toBeDefined();
      expect(result?.id).toBe(petMock.id);
      expect(result?.name).toBe(petMock.name);
      expect(result?.birthdate).toBe(petMock.birthdate);
      expect(result?.species).toBe(petMock.species);
      expect(result?.breed).toBe(petMock.breed);
    });

    it('should return null if pet does not exist', async () => {
      const petid = '123';
      prismaMock.pet.findUnique.mockResolvedValue(null);

      const result: Pet | null = await service.getPetById(petid);

      expect(result).toBeNull();
    });
  });

  describe('searchPets', () => {
    const petsMock = [
      {
        id: '1',
        name: 'Firulais',
        birthdate: new Date('2020-01-01'),
        species: EPetSpecies.PERRO,
        breed: 'Labrador',
        gender: EPetGender.MACHO,
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: 'owner-1',
        owner: {
          id: 'owner-1',
          name: 'Rafa',
        },
      },
    ];

    beforeEach(() => {
      jest.clearAllMocks(); // opcional, para limpiar llamadas anteriores
    });

    it('should return paginated pets without filters', async () => {
      prismaMock.pet.findMany.mockResolvedValue(petsMock);
      prismaMock.pet.count.mockResolvedValue(1);

      const result = await service.searchPets();

      expect(prismaMock.pet.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'asc' },
      });

      expect(prismaMock.pet.count).toHaveBeenCalledWith({ where: {} });

      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        size: 10,
        sort: 'asc',
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Firulais');
    });

    it('should return paginated pets with filters', async () => {
      const metaQuery: MetaQueryDto = {
        searchTerm: 'Firulais',
        page: 1,
        size: 10,
      };
    });

    it('should filter pets by searchTerm', async () => {
      prismaMock.pet.findMany.mockResolvedValue(petsMock);
      prismaMock.pet.count.mockResolvedValue(1);

      const result = await service.searchPets({ searchTerm: 'firu' });

      expect(prismaMock.pet.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: expect.arrayContaining([
              { name: { contains: 'firu' } },
              { breed: { contains: 'firu' } },
              { gender: { equals: 'FIRU' } },
              { species: { equals: 'FIRU' } },
            ]),
          },
        }),
      );

      expect(result.data[0].name).toBe('Firulais');
    });

    it('should apply pagination and sorting correctly', async () => {
      prismaMock.pet.findMany.mockResolvedValue(petsMock);
      prismaMock.pet.count.mockResolvedValue(1);

      const result = await service.searchPets({
        page: 2,
        size: 5,
        sort: SortOrder.DESC,
      });

      expect(prismaMock.pet.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
          orderBy: { createdAt: 'desc' },
        }),
      );

      expect(result.meta).toEqual({
        total: 1,
        page: 2,
        size: 5,
        sort: 'desc',
      });
    });

    it('should return empty results if no pets match', async () => {
      prismaMock.pet.findMany.mockResolvedValue([]);
      prismaMock.pet.count.mockResolvedValue(0);

      const result = await service.searchPets({ searchTerm: 'inexistente' });

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });
  });

  describe('updatePet', () => {
    const petForUpdateDto: PetForUpdateDto = {
      id: '123',
      name: 'LOLA',
      birthdate: new Date('2020-01-02'),
      species: EPetSpecies.GATO,
      breed: 'MESTIZA',
      gender: EPetGender.HEMBRA,
    };
  
    const originalPet = {
      id: '123',
      name: 'Buddy',
      birthdate: new Date('2020-01-01'),
      species: EPetSpecies.PERRO,
      breed: 'Labrador',
      gender: EPetGender.MACHO,
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should update a pet', async () => {
      prismaMock.pet.findUnique.mockResolvedValue(originalPet);
      prismaMock.pet.update.mockResolvedValue({ ...originalPet, ...petForUpdateDto });
  
      const result = await service.updatePet(petForUpdateDto);
  
      expect(result).toBeDefined();
      expect(result.name).toBe(petForUpdateDto.name);
      expect(result.birthdate).toBe(petForUpdateDto.birthdate);
      expect(result.species).toBe(petForUpdateDto.species);
      expect(result.breed).toBe(petForUpdateDto.breed);
      expect(result.gender).toBe(petForUpdateDto.gender);
    });
  
    it('should throw if pet does not exist', async () => {
      prismaMock.pet.findUnique.mockResolvedValue(null);
  
      await expect(service.updatePet(petForUpdateDto)).rejects.toThrow(BadRequestException);
      await expect(service.updatePet(petForUpdateDto)).rejects.toThrow('La mascota no existe');
    });
  
    it('should throw if birthdate is in the future', async () => {
      prismaMock.pet.findUnique.mockResolvedValue(originalPet);
  
      const futureDto = {
        ...petForUpdateDto,
        birthdate: new Date(Date.now() + 1000000),
      };
  
      await expect(service.updatePet(futureDto)).rejects.toThrow(BadRequestException);
      await expect(service.updatePet(futureDto)).rejects.toThrow('La fecha de nacimiento no puede ser en el futuro');
    });
  
    it('should ignore undefined fields', async () => {
      prismaMock.pet.findUnique.mockResolvedValue(originalPet);
  
      const partialDto: PetForUpdateDto = {
        id: '123',
        name: 'Lola',
        gender: EPetGender.HEMBRA,
      };
  
      prismaMock.pet.update.mockResolvedValue({
        ...originalPet,
        ...partialDto,
      });
  
      const result = await service.updatePet(partialDto);
  
      expect(result.name).toBe('Lola');
      expect(result.gender).toBe(EPetGender.HEMBRA);
    });
  });

  describe('deletePet', () => {
    const petMock = {
      id: '123',
      name: 'Buddy',
      birthdate: new Date('2020-01-01'),
      species: EPetSpecies.PERRO,
      breed: 'Labrador',
      gender: EPetGender.MACHO,
    };
  
    it('should delete a pet', async () => {
      const petId = '123';
      prismaMock.pet.findUnique.mockResolvedValue(petMock);
      prismaMock.pet.delete.mockResolvedValue(petMock);
  
      await service.deletePet(petId);
  
      expect(prismaMock.pet.delete).toHaveBeenCalledWith({
        where: { id: petId },
      });
    });
  
    it('should throw BadRequestException if pet does not exist', async () => {
      const petId = '123';
      prismaMock.pet.findUnique.mockResolvedValue(null);
  
      await expect(service.deletePet(petId)).rejects.toThrow(BadRequestException);
      await expect(service.deletePet(petId)).rejects.toThrow('La mascota no existe.');
    });
  });
  
  describe('getPetOwnerByName', () => {
    const petMock = {
      id: '123',
      name: 'Buddy',
      birthdate: new Date('2020-01-01'),
      species: EPetSpecies.PERRO,
      breed: 'Labrador',
      gender: EPetGender.MACHO,
      ownerId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  
    it('should get a pet owner by name', async () => {
      const petOwnerId = '1';
      prismaMock.pet.findFirst.mockResolvedValue(petMock);
  
      const result = await service.getPetOwnerByName(petMock.name, petOwnerId);
  
      expect(result).toBeDefined();
      expect(result?.name).toBe(petMock.name);
      expect(result?.ownerId).toBe(petMock.ownerId);
    });

    it('should return null if pet does not exist', async () => {
      const petOwnerId = '123';
      prismaMock.pet.findFirst.mockResolvedValue(null);

      const result = await service.getPetOwnerByName(petMock.name, petOwnerId);

      expect(result).toBeNull();
    });
  });

  describe('validateOwnerExists', () => {
    it('should throw BadRequestException if owner does not exist', async () => {
      const ownerId = '123';
      prismaMock.owner.findUnique.mockResolvedValue(null);

      await expect(service.validateOwnerExists(ownerId)).rejects.toThrow(BadRequestException);
      await expect(service.validateOwnerExists(ownerId)).rejects.toThrow('El dueño no existe');
    });
  });
});
