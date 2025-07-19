import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PetsService } from '../services/pets.service';
import { PetForCreationDto } from '../dtos/petForCreationDto.dto';
import { PetResponse } from '../dtos/pet.response';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { EUserRole } from 'generated/prisma';
import { PetForUpdateDto } from '../dtos/petForUpdateDto.dto';
import { petToPetResponse } from 'src/common/mappers/pet.mapper';
import { MetaQueryDto } from 'src/common/utils/pagination/metaQueryDto.dto';
import { PaginatedResponse } from 'src/common/utils/pagination/paginated.response';
  
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

  @Get('search')
  @ApiOperation({ summary: 'Buscar mascotas' })
  @ApiResponse({ status: 200, description: 'Mascotas encontradas exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al buscar las mascotas' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.RECEPCIONISTA, EUserRole.SUPERADMIN)
  async searchPets(@Query() query: MetaQueryDto): Promise<PaginatedResponse<PetResponse>> {
    return await this.petsService.searchPets(query);
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una mascota' })
  @ApiResponse({ status: 200, description: 'Mascota obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.RECEPCIONISTA, EUserRole.SUPERADMIN)
  async getPet(@Param('id') id: string): Promise<PetResponse> {
    const pet = await this.petsService.getPetById(id);
    if (!pet) throw new NotFoundException('La mascota no existe.');
    return petToPetResponse(pet);
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

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una mascota' })
  @ApiResponse({ status: 200, description: 'Mascota eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.RECEPCIONISTA, EUserRole.SUPERADMIN)
  async deletePet(@Param('id') id: string): Promise<void> {
    return await this.petsService.deletePet(id);
  }
}
