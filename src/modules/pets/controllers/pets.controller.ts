import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { PetsService } from '../services/pets.service';
import { PetForCreationDto } from '../dtos/petForCreationDto.dto';
import { PetResponse } from '../dtos/pet.response';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { EUserRole } from 'generated/prisma';
import { PetForUpdateDto } from '../dtos/petForUpdateDto.dto';
  
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una mascota' })
  @ApiResponse({ status: 201, description: 'Mascota creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al crear la mascota' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.RECEPCIONISTA, EUserRole.SUPERADMIN)
  async createPet(@Body() createPetDto: PetForCreationDto): Promise<PetResponse> {
    return await this.petsService.createPet(createPetDto);
  }
  

  @Patch()
  @ApiOperation({ summary: 'Actualizar una mascota' })
  @ApiResponse({ status: 200, description: 'Mascota actualizada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al actualizar la mascota' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.RECEPCIONISTA, EUserRole.SUPERADMIN)
  async updatePet(@Body() updatePetDto: PetForUpdateDto): Promise<PetResponse> {
    return await this.petsService.updatePet(updatePetDto);
  }
}
