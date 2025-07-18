import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './config/prisma/prisma.service';
import configuration from './config/configuration';
import { UsersService } from './modules/users/services/users.service';
import { EUserRole } from 'generated/prisma';
import { AuthModule } from './modules/auth/auth.module';
import { RegisterDto } from './modules/auth/dtos/register.dto';
import { OwnersModule } from './modules/owners/owners.module';
import { PetsModule } from './modules/pets/pets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    UsersModule,
    AuthModule,
    OwnersModule,
    PetsModule,
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const superAdmin = await this.usersService.superAdminExists();
    if (superAdmin) return;

    const superAdminRequest:RegisterDto = {
      name: this.configService.get('superAdmin.name')!,
      email: this.configService.get('superAdmin.email')!,
      password: this.configService.get('superAdmin.password')!,
      role: EUserRole.SUPERADMIN,
    }

    await this.usersService.createUser(superAdminRequest);
  }
}
