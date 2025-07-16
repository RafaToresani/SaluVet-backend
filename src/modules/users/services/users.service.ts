import { ConflictException, Injectable } from '@nestjs/common';
import { EUserRole, User } from 'generated/prisma';
import { PrismaService } from 'src/config/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  
  
  constructor(private readonly prisma: PrismaService) {}

  getUsers() {
    return this.prisma.user.findMany();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(name: string, email: string, password: string, role: EUserRole) {
    const superAdmin = await this.superAdminExists();
    if(role === EUserRole.SUPERADMIN && superAdmin) throw new ConflictException('Superadmin already exists');
    return await this.prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role,
      },
    });
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
