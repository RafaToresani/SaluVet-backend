import { ConflictException, Injectable } from '@nestjs/common';
import { EUserRole } from 'generated/prisma';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class UsersService {
  
  constructor(private readonly prisma: PrismaService) {}

  getUsers() {
    return this.prisma.user.findMany();
  }

  async createUser(name: string, email: string, password: string, role: EUserRole) {
    await this.superAdminExists();
    
    return await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });
  }

  async superAdminExists(): Promise<void>{
    const superAdmin = await this.prisma.user.findFirst({
      where: {
        role: EUserRole.SUPERADMIN,
      },
    });
    if(superAdmin) throw new ConflictException('Superadmin already exists');
  }

  
}
