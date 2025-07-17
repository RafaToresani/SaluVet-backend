import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EUserRole, User } from 'generated/prisma';
import { PrismaService } from 'src/config/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/modules/auth/dtos/register.dto';
import { UserResponse } from '../dto/user.response';
import { userToUserResponse } from 'src/common/mappers/user.mapper';
@Injectable()
export class UsersService {

  constructor(private readonly prisma: PrismaService) {}

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


  async superAdminExists(): Promise<boolean>{
    const superAdmin = await this.prisma.user.findFirst({
      where: {
        role: EUserRole.SUPERADMIN,
      },
    });
    if(superAdmin) return true;
    return false;
  }


}
