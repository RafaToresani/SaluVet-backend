import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [PrismaService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
