import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PetsService } from './services/pets.service';
import { PetsController } from './controllers/pets.controller';

@Module({
  controllers: [PetsController],
  providers: [PetsService, PrismaService],
  exports: [PetsService]
})
export class PetsModule {}
