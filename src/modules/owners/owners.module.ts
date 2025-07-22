import { Module } from '@nestjs/common';
import { OwnersController } from './controllers/owners.controller';
import { OwnersService } from './services/owners.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [OwnersController],
  providers: [OwnersService, PrismaService],
})
export class OwnersModule {}
