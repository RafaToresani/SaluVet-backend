import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { prismaMock } from 'test/mocks/prisma.mock';
import { createUserDtoMock, userRecepcionistaMock, userSuperadminMock, userVeterinarioMock } from 'test/mocks/users/users.mock';
import { ScheduleConfigService } from 'src/modules/schedule/services/schedule-config.service';
import { ClinicalServicesService } from 'src/modules/clinical-services/services/clinical-services.service';
import { scheduleConfigServiceMock } from 'test/mocks/schedules/schedule-config.service.mock';
import { clinicalServicesServiceMock } from 'test/mocks/clinical-services/clinical-services.service.mock';
import { configServiceMock } from 'test/mocks/config/config-service.service.mock';
import { ConfigService } from '@nestjs/config';
import { EUserRole } from 'generated/prisma';
import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: ScheduleConfigService, useValue: scheduleConfigServiceMock },
        { provide: ClinicalServicesService, useValue: clinicalServicesServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

    describe('getUser', () => {
    it('should return a user', async () => {
      const user = userVeterinarioMock;
      prismaMock.user.findUnique.mockResolvedValue(user);
      const result = await service.getUser(user.id);
      expect(result.id).toEqual(user.id);
      expect(result.name).toEqual(user.name);
      expect(result.email).toEqual(user.email);
      expect(result.role).toEqual(user.role);
      expect(result.isActive).toEqual(user.isActive);
    });

    it('should throw an error if the user does not exist', async () => {
      const user = userVeterinarioMock;
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(service.getUser(user.id)).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('getUsers', () => {
    const users = [userVeterinarioMock, userRecepcionistaMock];
    it('should return an array of users', async () => {
      prismaMock.user.findMany.mockResolvedValue(users);
      const result = await service.getUsers();
      expect(result.length).toEqual(users.length);
      expect(result[0].id).toEqual(users[0].id);
      expect(result[0].name).toEqual(users[0].name);
      expect(result[0].email).toEqual(users[0].email);
      expect(result[0].role).toEqual(users[0].role);
      expect(result[0].isActive).toEqual(users[0].isActive);
      expect(result[1].id).toEqual(users[1].id);
    });
  });

  describe('getUserById', () => {
    it('should return a user', async () => {
      const user = userVeterinarioMock;
      prismaMock.user.findUnique.mockResolvedValue(user);
      const result = await service.getUserById(user.id);
      expect(result?.id).toEqual(user.id);
    });

    it('should return null if the user does not exist', async () => {
      const user = userVeterinarioMock;
      prismaMock.user.findUnique.mockResolvedValue(null);
      const result = await service.getUserById(user.id);
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user', async () => {
      const user = userVeterinarioMock;
      prismaMock.user.findUnique.mockResolvedValue(user);
      const result = await service.findByEmail(user.email);
      expect(result?.id).toEqual(user.id);
    });

    it('should return null if the user does not exist', async () => {
      const user = userVeterinarioMock;
      prismaMock.user.findUnique.mockResolvedValue(null);
      const result = await service.findByEmail(user.email);
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a veterinarian user and initialize related data', async () => {
      const createUserDto = {
        id: 'uuid-veterinario-1',
        name: 'Dr. Vet',
        email: 'vet@example.com',
        password: 'pass1234',
        role: EUserRole.VETERINARIO,
      };
  
      // Mocks de funciones llamadas internamente
      jest.spyOn(service, 'superAdminExists').mockResolvedValue(false);
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        ...createUserDto,
        password: 'hashedpassword', // Simula password hasheado
      });
      scheduleConfigServiceMock.initializeScheduleConfig.mockResolvedValue(undefined);
      clinicalServicesServiceMock.initializeUserClinicalServices.mockResolvedValue(undefined);
  
      const result = await service.createUser(createUserDto);
  
      expect(prismaMock.user.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          email: createUserDto.email,
          name: createUserDto.name,
          role: createUserDto.role,
        }),
      }));
  
      expect(scheduleConfigServiceMock.initializeScheduleConfig).toHaveBeenCalledWith(createUserDto.id);
      expect(clinicalServicesServiceMock.initializeUserClinicalServices).toHaveBeenCalledWith(createUserDto.id);
  
      expect(result).toHaveProperty('id', createUserDto.id);
      expect(result).toHaveProperty('email', createUserDto.email);
    });
  
    it('should throw conflict if superadmin already exists', async () => {
      jest.spyOn(service, 'superAdminExists').mockResolvedValue(true);
      const createUserDto = { role: EUserRole.SUPERADMIN, email: 'admin@admin.com', name: 'Admin', password: '1234' };
  
      await expect(service.createUser(createUserDto)).rejects.toThrow(ConflictException);
    });
  
    it('should throw conflict if email already exists', async () => {
      jest.spyOn(service, 'superAdminExists').mockResolvedValue(false);
      jest.spyOn(service, 'findByEmail').mockResolvedValue({ id: 'existing-id' } as any);
  
      const createUserDto = { role: EUserRole.RECEPCIONISTA, email: 'exists@example.com', name: 'User', password: '1234' };
  
      await expect(service.createUser(createUserDto)).rejects.toThrow(ConflictException);
    });
  });
  
  describe('toggleActive', () => {
    it('should toggle the active status of a user', async () => {
      const user = userVeterinarioMock;
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.user.update.mockResolvedValue({
        ...user,
        isActive: !user.isActive,
      });
      const result = await service.toggleActive(user.id);
      expect(result.id).toEqual(user.id);
      expect(result.isActive).toEqual(!user.isActive);
    });

    it('should throw an error if the user does not exist', async () => {
      const user = userVeterinarioMock;
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(service.toggleActive(user.id)).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const user = userVeterinarioMock;
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.user.update.mockResolvedValue({
        ...user,
        name: 'New Name',
      });
      const result = await service.updateUser(user.id, {
        name: 'New Name',
      });
      expect(result.id).toEqual(user.id);
      expect(result.name).toEqual('New Name');
    });

    it('should throw an error if the user does not exist', async () => {
      const user = userVeterinarioMock;
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(service.updateUser(user.id, { name: 'New Name' })).rejects.toThrow('Usuario no encontrado');
    });

    it('should throw an error if the email already exists', async () => {
      const user = userVeterinarioMock;
    
      prismaMock.user.findUnique.mockResolvedValue(user); // Para userFound
    
      const existingUserWithEmail = { ...user, id: 'otro-id', email: 'newemail@example.com' };
      jest.spyOn(service, 'findByEmail').mockResolvedValue(existingUserWithEmail);
    
      await expect(
        service.updateUser(user.id, {
          name: 'New Name',
          email: 'newemail@example.com',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('updateUserBySuperadmin', () => {
    const user = userVeterinarioMock;
  
    it('should update the user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(user); // userFound
      prismaMock.user.update.mockResolvedValue({ ...user, name: 'Nuevo Nombre' });
  
      const result = await service.updateUserBySuperadmin(user.id, {
        name: 'Nuevo Nombre',
      });
  
      expect(result.name).toEqual('Nuevo Nombre');
      expect(result.id).toEqual(user.id);
    });
  
    it('should throw if user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
  
      await expect(
        service.updateUserBySuperadmin(user.id, { name: 'Nuevo Nombre' }),
      ).rejects.toThrow(NotFoundException);
    });
  
    it('should throw if email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(user);
  
      const existingUser = { ...user, id: 'otro-id', email: 'nuevo@email.com' };
      jest.spyOn(service, 'findByEmail').mockResolvedValue(existingUser);
  
      await expect(
        service.updateUserBySuperadmin(user.id, { email: 'nuevo@email.com' }),
      ).rejects.toThrow(ConflictException);
    });
  
    it('should throw if trying to change role to SUPERADMIN', async () => {
      prismaMock.user.findUnique.mockResolvedValue(user);
  
      await expect(
        service.updateUserBySuperadmin(user.id, { role: EUserRole.SUPERADMIN }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('superAdminExists', () => {
    it('should return true if a superadmin exists', async () => {
      prismaMock.user.findFirst.mockResolvedValue(userSuperadminMock);
      const result = await service.superAdminExists();
      expect(result).toBe(true);
    });

    it('should return false if no superadmin exists', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);
      const result = await service.superAdminExists();
      expect(result).toBe(false);
    });
  });

  
  describe('updatePassword', () => {
    const user = { ...userVeterinarioMock, password: 'hashedOldPassword' };
  
    it('should update the password of a user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.user.update.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never); // old password match
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedNewPassword' as never);
  
      const result = await service.updatePassword(user.id, {
        oldPassword: 'oldPassword',
        newPassword: 'newPassword',
      });
  
      expect(result.id).toEqual(user.id);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: { password: 'hashedNewPassword' },
      });
    });
  
    it('should throw if the user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
  
      await expect(
        service.updatePassword(user.id, {
          oldPassword: 'oldPassword',
          newPassword: 'newPassword',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  
    it('should throw if old password does not match', async () => {
      prismaMock.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never); // no match
  
      await expect(
        service.updatePassword(user.id, {
          oldPassword: 'wrongPassword',
          newPassword: 'newPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
  describe('changePasswordBySuperadmin', () => {
    const user = userVeterinarioMock;
  
    it('should update the password to reset password', async () => {
      const hashedPassword = 'hashedResetPassword';
  
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.user.update.mockResolvedValue(user);
      configServiceMock.get.mockReturnValue('reset1234');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
  
      const result = await service.changePasswordBySuperadmin(user.id);
  
      expect(result.id).toEqual(user.id);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    });
  
    it('should throw if user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
  
      await expect(service.changePasswordBySuperadmin(user.id)).rejects.toThrow(NotFoundException);
    });
  
    it('should throw if reset password config is missing', async () => {
      prismaMock.user.findUnique.mockResolvedValue(user);
      configServiceMock.get.mockReturnValue(null);
  
      await expect(service.changePasswordBySuperadmin(user.id)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
