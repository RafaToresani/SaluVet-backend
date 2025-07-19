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
import { ScheduleModule } from './modules/schedule/schedule.module';
import { ClinicalServicesModule } from './modules/clinical-services/clinical-services.module';
import { ClinicalServicesService } from './modules/clinical-services/services/clinical-services.service';
import * as fs from 'fs';
import * as path from 'path';

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
    ScheduleModule,
    ClinicalServicesModule,
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly clinicalService: ClinicalServicesService,
  ) {}

  async onApplicationBootstrap() {
    await this.ensureSuperAdmin();
    await this.seedClinicalServices();
  }

  private async ensureSuperAdmin() {
    const superAdmin = await this.usersService.superAdminExists();
    if (superAdmin) return;

    const superAdminRequest: RegisterDto = {
      name: this.configService.get('superAdmin.name')!,
      email: this.configService.get('superAdmin.email')!,
      password: this.configService.get('superAdmin.password')!,
      role: EUserRole.SUPERADMIN,
    };

    await this.usersService.createUser(superAdminRequest);
  }


  private async seedClinicalServices() {
    const existing = await this.clinicalService.count(); // método que te diga si hay servicios

    if (existing > 0) return;

    const filePath = path.join(__dirname, 'common', 'seeds', 'clinical-services.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const services = JSON.parse(fileContent);

    await this.clinicalService.bulkCreate(services);
  }
}
