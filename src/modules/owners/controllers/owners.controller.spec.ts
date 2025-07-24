import { Test, TestingModule } from '@nestjs/testing';
import { OwnersController } from './owners.controller';
import { OwnersService } from '../services/owners.service';
import { ownersServiceMock } from 'test/mocks/owner/owners.service.mock';
import { metaQueryDtoMock, ownerCreateDto, ownerMock, ownerUpdateDto } from 'test/mocks/owner/owners.mock';
import { BadRequestException } from '@nestjs/common';

describe('OwnersController', () => {
  let controller: OwnersController;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OwnersController],
      providers: [
        { provide: OwnersService, useValue: ownersServiceMock },
      ],
    }).compile();

    controller = module.get<OwnersController>(OwnersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOwner', () => {
    it('should create an owner', async () => {
      ownersServiceMock.createOwner.mockResolvedValue(ownerMock);
      const result = await controller.createOwner(ownerCreateDto);
      expect(result.dni).toEqual(ownerCreateDto.dni);
      expect(result.name).toEqual(ownerCreateDto.name);
      expect(result.lastname).toEqual(ownerCreateDto.lastname);
      expect(result.email).toEqual(ownerCreateDto.email);
      expect(result.phone).toEqual(ownerCreateDto.phone);
      expect(result.address).toEqual(ownerCreateDto.address);
      expect(ownersServiceMock.createOwner).toHaveBeenCalledWith(ownerCreateDto);
    });

    it('should throw an error if the dni is already taken', async () => {
      ownersServiceMock.createOwner.mockRejectedValue(new BadRequestException('El dni ingresado ya está registrado.'));
      await expect(controller.createOwner(ownerCreateDto)).rejects.toThrow(BadRequestException);
      expect(ownersServiceMock.createOwner).toHaveBeenCalledWith(ownerCreateDto);
    });

    it('should throw an error if the phone is already taken', async () => {
      ownersServiceMock.createOwner.mockRejectedValue(new BadRequestException('El teléfono ingresado ya está registrado.'));
      await expect(controller.createOwner(ownerCreateDto)).rejects.toThrow(BadRequestException);
      expect(ownersServiceMock.createOwner).toHaveBeenCalledWith(ownerCreateDto);
    });
  });

  describe('searchOwners', () => {
    it('should search owners', async () => {
      const mockResponse = {
        data: [ownerMock],
        meta: {
          total: 1,
          page: 1,
          size: 10,
          sort: 'asc',
        },
      };
      ownersServiceMock.searchOwners.mockResolvedValue(mockResponse);
  
      const result = await controller.searchOwners(metaQueryDtoMock);
  
      expect(result.data).toEqual(mockResponse.data);
      expect(result.meta).toEqual(mockResponse.meta);
      expect(ownersServiceMock.searchOwners).toHaveBeenCalledWith(metaQueryDtoMock);
    });
  });

  describe('updateOwner', () => {
    it('should update an owner', async () => {
      ownersServiceMock.updateOwner.mockResolvedValue(ownerMock);
      const result = await controller.updateOwner(ownerUpdateDto);
      expect(result.dni).toEqual(ownerCreateDto.dni);
      expect(result.name).toEqual(ownerCreateDto.name);
      expect(result.lastname).toEqual(ownerCreateDto.lastname);
      expect(result.email).toEqual(ownerCreateDto.email);
      expect(result.phone).toEqual(ownerCreateDto.phone);
      expect(result.address).toEqual(ownerCreateDto.address);
    });

    it('should throw an error if the owner does not exist', async () => {
      ownersServiceMock.updateOwner.mockRejectedValue(new BadRequestException('El dueño no existe.'));
      await expect(controller.updateOwner(ownerUpdateDto)).rejects.toThrow(BadRequestException);
      expect(ownersServiceMock.updateOwner).toHaveBeenCalledWith(ownerUpdateDto);
    });

    it('should throw an error if the dni is already taken', async () => {
      ownersServiceMock.updateOwner.mockRejectedValue(new BadRequestException('El dni ingresado ya está registrado.'));
      await expect(controller.updateOwner(ownerUpdateDto)).rejects.toThrow(BadRequestException);
      expect(ownersServiceMock.updateOwner).toHaveBeenCalledWith(ownerUpdateDto);
    })
  });

  describe('deleteOwner', () => {
    it('should delete an owner', async () => {
      ownersServiceMock.deleteOwner.mockResolvedValue(undefined);
      const result = await controller.deleteOwner(ownerMock.id);
      expect(result).toBeUndefined();
      expect(ownersServiceMock.deleteOwner).toHaveBeenCalledWith(ownerMock.id);
    });
  
    it('should throw an error if the owner does not exist', async () => {
      ownersServiceMock.deleteOwner.mockRejectedValue(new BadRequestException('El dueño no existe.'));
  
      await expect(controller.deleteOwner(ownerMock.id)).rejects.toThrow(BadRequestException);
      expect(ownersServiceMock.deleteOwner).toHaveBeenCalledWith(ownerMock.id);
    });
  });
  
});
