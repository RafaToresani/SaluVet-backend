import { Test, TestingModule } from '@nestjs/testing';
import { PetsController } from './pets.controller';
import { PetsService } from '../services/pets.service';
import { petsServiceMock } from 'test/mocks/pets/pets.service.mock';
import { petCreateDto, petMock, petUpdateDto } from 'test/mocks/pets/pets.mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { metaQueryDtoMock } from 'test/mocks/owner/owners.mock';

describe('PetsController', () => {
  let controller: PetsController;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetsController],
      providers: [
        { provide: PetsService, useValue: petsServiceMock },
      ],
    }).compile();

    controller = module.get<PetsController>(PetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPet', () => {
    it('should create a pet', async () => {
      petsServiceMock.createPet.mockResolvedValue(petMock);
      const result = await controller.createPet(petCreateDto);
      expect(result.name).toEqual(petCreateDto.name);
      expect(result.species).toEqual(petCreateDto.species);
      expect(result.breed).toEqual(petCreateDto.breed);
      expect(result.gender).toEqual(petCreateDto.gender);
      expect(petsServiceMock.createPet).toHaveBeenCalledWith(petCreateDto);
    });

    it('should throw an error if the pet already exists', async () => {
      petsServiceMock.createPet.mockRejectedValue(new BadRequestException('El dueño ya tiene una mascota con ese nombre'));
      await expect(controller.createPet(petCreateDto)).rejects.toThrow(BadRequestException);
      expect(petsServiceMock.createPet).toHaveBeenCalledWith(petCreateDto);
    });

    it('should throw an error if the birthdate is in the future', async () => {
      petsServiceMock.createPet.mockRejectedValue(new BadRequestException('La fecha de nacimiento no puede ser en el futuro'));
      await expect(controller.createPet(petCreateDto)).rejects.toThrow(BadRequestException);
      expect(petsServiceMock.createPet).toHaveBeenCalledWith(petCreateDto);
    });

    it('should throw an error if the owner does not exist', async () => {
      petsServiceMock.createPet.mockRejectedValue(new BadRequestException('El dueño no existe'));
      await expect(controller.createPet(petCreateDto)).rejects.toThrow(BadRequestException);
      expect(petsServiceMock.createPet).toHaveBeenCalledWith(petCreateDto);
    });
  });
  
  describe('searchPets', () => {
    it('should search pets', async () => {
      const mockResponse = {
        data: [petMock],
        meta: {
          total: 1,
          page: 1,
          size: 10,
          sort: 'asc',
        },
      };
  
      petsServiceMock.searchPets.mockResolvedValue(mockResponse);
  
      const result = await controller.searchPets(metaQueryDtoMock);
  
      expect(result).toEqual(mockResponse);
      expect(result.data).toEqual([petMock]);
      expect(result.meta).toEqual(mockResponse.meta);
      expect(petsServiceMock.searchPets).toHaveBeenCalledWith(metaQueryDtoMock);
    });
  });
  
  describe('getPet', () => {
    it('should get a pet', async () => {
      petsServiceMock.getPetById.mockResolvedValue(petMock);
      const result = await controller.getPet(petMock.id);
      expect(result.name).toEqual(petMock.name);
      expect(result.species).toEqual(petMock.species);
      expect(result.breed).toEqual(petMock.breed);
      expect(result.gender).toEqual(petMock.gender);
      expect(petsServiceMock.getPetById).toHaveBeenCalledWith(petMock.id);
    });

    it('should throw an error if the pet does not exist', async () => {
      petsServiceMock.getPetById.mockResolvedValue(null);
      await expect(controller.getPet(petMock.id)).rejects.toThrow(NotFoundException);
      expect(petsServiceMock.getPetById).toHaveBeenCalledWith(petMock.id);
    });
  });

  describe('updatePet', () => {
    it('should update a pet', async () => {
      const updatedPet = {
        ...petMock,
        ...petUpdateDto,
      };
      petsServiceMock.updatePet.mockResolvedValue(updatedPet);
  
      const result = await controller.updatePet(petUpdateDto);
  
      expect(result.name).toEqual(petUpdateDto.name);
      expect(result.species).toEqual(petUpdateDto.species);
      expect(result.breed).toEqual(petUpdateDto.breed);
      expect(result.gender).toEqual(petUpdateDto.gender);
      expect(petsServiceMock.updatePet).toHaveBeenCalledWith(petUpdateDto);
    });
  
    it('should throw an error if the pet does not exist', async () => {
      petsServiceMock.updatePet.mockRejectedValue(new NotFoundException('La mascota no existe'));
  
      await expect(controller.updatePet(petUpdateDto)).rejects.toThrow(NotFoundException);
      expect(petsServiceMock.updatePet).toHaveBeenCalledWith(petUpdateDto);
    });
  });
  
  describe('deletePet', () => {
    it('should delete a pet', async () => {
      petsServiceMock.deletePet.mockResolvedValue(undefined);
      const result = await controller.deletePet(petMock.id);
      expect(result).toBeUndefined();
      expect(petsServiceMock.deletePet).toHaveBeenCalledWith(petMock.id);
    });

    it('should throw an error if the pet does not exist', async () => {
      petsServiceMock.deletePet.mockRejectedValue(new NotFoundException('La mascota no existe'));
      await expect(controller.deletePet(petMock.id)).rejects.toThrow(NotFoundException);
      expect(petsServiceMock.deletePet).toHaveBeenCalledWith(petMock.id);
    });
  });
});
