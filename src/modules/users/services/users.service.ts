import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { EUserRole, User } from 'generated/prisma';
import { PrismaService } from 'src/config/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/modules/auth/dtos/register.dto';
import { UserResponse } from '../dto/user.response';
import { userToUserResponse } from 'src/common/mappers/user.mapper';
import { UserForUpdateDto } from '../dto/userForUpdateDto.dto';
import { UpdatePasswordDto } from '../dto/updatePasswordDto.dto';
import { UserForUpdateDtoBySuperAdminDto } from '../dto/userForUpdateDtoBySuperAdminDto.dto';
import { ConfigService } from '@nestjs/config';
import { ScheduleConfigService } from 'src/modules/schedule/services/schedule-config.service';
@Injectable()
export class UsersService {

  constructor(
    private readonly prisma: PrismaService, 
    private readonly configService: ConfigService,
    private readonly scheduleConfigService: ScheduleConfigService
  ) {}

  async getUser(id: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if(!user) throw new NotFoundException('Usuario no encontrado');
    return userToUserResponse(user);
  }

  async getUsers(role?: EUserRole, email?: string, name?: string): Promise<UserResponse[]> {
    const users = await this.prisma.user.findMany({
      where: {
        role: role ? role : undefined,
        email: email ? { contains: email} : undefined,
        name: name ? { contains: name} : undefined,
      },
    });

    return users.map((user) => userToUserResponse(user));
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(request:RegisterDto): Promise<UserResponse> {
    const superAdmin = await this.superAdminExists();
    if(request.role === EUserRole.SUPERADMIN && superAdmin) throw new ConflictException('No es posible crear un superadmin ya que ya existe uno');
    const existingUser = await this.findByEmail(request.email);
    if(existingUser) throw new ConflictException('El email ya está registrado');
    const hashedPassword = await bcrypt.hash(request.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: request.name,
        email: request.email,
        password: hashedPassword,
        role: request.role,
      },
    });

    if(user.role === EUserRole.VETERINARIO) {
      await this.scheduleConfigService.initializeScheduleConfig(user.id);
    }

    return userToUserResponse(user);
  }

  async toggleActive(id: string): Promise<UserResponse> {
    const userFound = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if(!userFound) throw new NotFoundException('Usuario no encontrado');
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: !userFound.isActive,
      },
    });
    return userToUserResponse(user);
  }

  async updateUser(userId: string, request: UserForUpdateDto): Promise<UserResponse> {
    const userFound = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if(!userFound) throw new NotFoundException('Usuario no encontrado');
    if(request.email) {
      const existingUser = await this.findByEmail(request.email);
      if(existingUser) throw new ConflictException('El email ya está registrado');
    }
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: request.name ? request.name : userFound.name,
        email: request.email ? request.email : userFound.email,
      },
    });
    return userToUserResponse(user);
  }

  async updateUserBySuperadmin(id: string, request: UserForUpdateDtoBySuperAdminDto): Promise<UserResponse> {
    const userFound = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if(!userFound) throw new NotFoundException('Usuario no encontrado');
    if(request.email) {
      const existingUser = await this.findByEmail(request.email);
      if(existingUser) throw new ConflictException('El email ya está registrado');
    }
    if(request.role === EUserRole.SUPERADMIN) throw new BadRequestException('No es posible cambiar el rol a superadmin');
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: request.name ? request.name : userFound.name,
        email: request.email ? request.email : userFound.email,
        role: request.role ? request.role : userFound.role,
      },
    });
    return userToUserResponse(user);
  }

  async superAdminExists(): Promise<boolean>{
    const superAdmin = await this.prisma.user.findFirst({
      where: {
        role: EUserRole.SUPERADMIN,
      },
    });
    if(superAdmin) return true;
    return false;
  }

  async updatePassword(userId: string, request: UpdatePasswordDto): Promise<UserResponse> {
    const userFound = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if(!userFound) throw new NotFoundException('Usuario no encontrado');
    const isPasswordValid = await bcrypt.compare(request.oldPassword, userFound.password);
    if(!isPasswordValid) throw new UnauthorizedException('Las contraseñas no coinciden');
    const hashedPassword = await bcrypt.hash(request.newPassword, 10);
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    return userToUserResponse(user);
  }

  async changePasswordBySuperadmin(id: string): Promise<UserResponse> {
    const userFound = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if(!userFound) throw new NotFoundException('Usuario no encontrado');
    const resetPassword = this.configService.get('resetPassword');
    if(!resetPassword) throw new InternalServerErrorException('No se pudo obtener la contraseña de reseteo');
    const hashedPassword = await bcrypt.hash(resetPassword, 10);
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });
    return userToUserResponse(user);
  }
}
