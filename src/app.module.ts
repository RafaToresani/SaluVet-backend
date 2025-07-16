import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './config/prisma/prisma.service';
import configuration from './config/configuration';
import { UsersService } from './modules/users/services/users.service';
import { EUserRole } from 'generated/prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    UsersModule,
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

    await this.usersService.createUser(
      this.configService.get('superAdmin.name')!,
      this.configService.get('superAdmin.email')!,
      this.configService.get('superAdmin.password')!,
      EUserRole.SUPERADMIN,
    );
  }
}
