import { Test, TestingModule } from '@nestjs/testing';
import { PetsService } from './pets.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PetForCreationDto } from '../dtos/petForCreationDto.dto';
import { EPetGender, EPetSpecies } from 'generated/prisma';
import { BadRequestException } from '@nestjs/common';

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
    const petWithNameAlreadyExistsMessage = 'El dueño ya tiene un mascota con ese nombre';
    const birthdateInFutureMessage = 'La fecha de nacimiento no puede ser en el futuro';
    
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
    
      await expect(service.createPet(createPetDto)).rejects.toThrow(BadRequestException);
    });
    
  });
});
