import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { usersServiceMock } from 'test/mocks/users/users.service.mock';
import { createUserDtoMock, updatePasswordDtoMock, updateUserDtoMock, userRecepcionistaMock, userVeterinarioMock } from 'test/mocks/users/users.mock';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { EUserRole } from 'generated/prisma';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{provide: UsersService, useValue: usersServiceMock}],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should call UsersService.createUser and return the created user', async () => {
      usersServiceMock.createUser.mockResolvedValue(userVeterinarioMock);
  
      const result = await controller.createUser(createUserDtoMock);
  
      expect(usersServiceMock.createUser).toHaveBeenCalledWith(createUserDtoMock);
  
      expect(result).toEqual(userVeterinarioMock);
    });
  
    it('should propagate exceptions thrown by UsersService', async () => {
      usersServiceMock.createUser.mockRejectedValue(new ConflictException('Email ya registrado'));
  
      await expect(controller.createUser(createUserDtoMock)).rejects.toThrow(ConflictException);
    });
  });
  
  describe('getUsers', () => {
    it('should call UsersService.getUsers and return the users', async () => {
      usersServiceMock.getUsers.mockResolvedValue([userVeterinarioMock]);
      const getUsersQueryDtoMock = {
        role: EUserRole.VETERINARIO,
        email: 'test@test.com',
        name: 'Test',
      };
      const result = await controller.getUsers(getUsersQueryDtoMock);
      expect(result).toEqual([userVeterinarioMock]);
    });
  });

  describe('getUser', () => {
    it('should call UsersService.getUser and return the user', async () => {
      usersServiceMock.getUser.mockResolvedValue(userVeterinarioMock);
      const result = await controller.getUser(userVeterinarioMock.id);
      expect(result).toEqual(userVeterinarioMock);
    });

    it('should propagate exceptions thrown by UsersService', async () => {
      usersServiceMock.getUser.mockRejectedValue(new NotFoundException('Usuario no encontrado'));
      await expect(controller.getUser(userVeterinarioMock.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleActive', () => {
    it('should call UsersService.toggleActive and return the user', async () => {
      usersServiceMock.toggleActive.mockResolvedValue(userVeterinarioMock);
      const result = await controller.toggleActive(userVeterinarioMock.id);
      expect(result).toEqual(userVeterinarioMock);
    });

    it('should propagate exceptions thrown by UsersService', async () => {
      usersServiceMock.toggleActive.mockRejectedValue(new NotFoundException('Usuario no encontrado'));
      await expect(controller.toggleActive(userVeterinarioMock.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should call UsersService.updateUser and return the updated user', async () => {
      // Mockear respuesta del service
      usersServiceMock.updateUser.mockResolvedValue(userRecepcionistaMock);
  
      // Llamar al método del controller con parámetros
      const result = await controller.updateUser(userVeterinarioMock.id, updateUserDtoMock);
  
      // Validar que el resultado tiene los datos esperados
      expect(result.role).toEqual(userRecepcionistaMock.role);
      expect(result.name).toEqual(userRecepcionistaMock.name);
      expect(result.email).toEqual(userRecepcionistaMock.email);
  
      // Confirmar que el service fue llamado con los argumentos correctos
      expect(usersServiceMock.updateUser).toHaveBeenCalledWith(userVeterinarioMock.id, updateUserDtoMock);
    });
  
    it('should propagate exceptions thrown by UsersService', async () => {
      usersServiceMock.updateUser.mockRejectedValue(new NotFoundException('Usuario no encontrado'));
      await expect(controller.updateUser(userVeterinarioMock.id, updateUserDtoMock)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUserBySuperadmin', () => {
    it('should call UsersService.updateUserBySuperadmin and return the updated user', async () => {
      usersServiceMock.updateUserBySuperadmin.mockResolvedValue(userRecepcionistaMock);
      const result = await controller.updateUserBySuperadmin(userVeterinarioMock.id, updateUserDtoMock);
      expect(result).toEqual(userRecepcionistaMock);
    });

    it('should propagate exceptions thrown by UsersService', async () => {
      usersServiceMock.updateUserBySuperadmin.mockRejectedValue(new NotFoundException('Usuario no encontrado'));
      await expect(controller.updateUserBySuperadmin(userVeterinarioMock.id, updateUserDtoMock)).rejects.toThrow(NotFoundException);
    });
  });

  describe('changePasswordBySuperadmin', () => {
    it('should call UsersService.changePasswordBySuperadmin and return the updated user', async () => {
      usersServiceMock.changePasswordBySuperadmin.mockResolvedValue(userRecepcionistaMock);
      const result = await controller.changePasswordBySuperadmin(userVeterinarioMock.id);
      expect(result).toEqual(userRecepcionistaMock);
    });

    it('should propagate exceptions thrown by UsersService', async () => {
      usersServiceMock.changePasswordBySuperadmin.mockRejectedValue(new NotFoundException('Usuario no encontrado'));
      await expect(controller.changePasswordBySuperadmin(userVeterinarioMock.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePassword', () => {
    it('should call UsersService.updatePassword and return the updated user', async () => {
      usersServiceMock.updatePassword.mockResolvedValue(userRecepcionistaMock);
      const result = await controller.updatePassword(userVeterinarioMock.id, updatePasswordDtoMock);
      expect(result).toEqual(userRecepcionistaMock);
    });

    it('should propagate exceptions thrown by UsersService', async () => {
      usersServiceMock.updatePassword.mockRejectedValue(new NotFoundException('Usuario no encontrado'));
      await expect(controller.updatePassword(userVeterinarioMock.id, updatePasswordDtoMock)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMyProfile', () => {
    it('should call UsersService.updateUser and return the updated user', async () => {
      usersServiceMock.updateUser.mockResolvedValue(userRecepcionistaMock);
      const result = await controller.updateUser(userVeterinarioMock.id, updateUserDtoMock);
      expect(result).toEqual(userRecepcionistaMock);
    });

    it('should propagate exceptions thrown by UsersService', async () => {
      usersServiceMock.updateUser.mockRejectedValue(new NotFoundException('Usuario no encontrado'));
      await expect(controller.updateUser(userVeterinarioMock.id, updateUserDtoMock)).rejects.toThrow(NotFoundException);
    });
  });
});
