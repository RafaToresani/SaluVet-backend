import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OwnersService } from '../services/owners.service';
import { OwnerForCreationDto } from '../dtos/ownerForCreationDto.dto';
import { OwnerResponse } from '../dtos/owner.response';
import { Roles } from 'src/common/decorators/role.decorator';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { EUserRole } from 'generated/prisma';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { OwnerForUpdateDto } from '../dtos/ownerForUpdateDto.dto';
import { MetaQueryDto } from 'src/common/utils/pagination/metaQueryDto.dto';
import { PaginatedResponse } from 'src/common/utils/pagination/paginated.response';
import { OwnerForSearchDto } from '../dtos/ownerForSearchDto.dto';

@Controller('owners')
@ApiTags('Owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo dueño' })
  @ApiResponse({ status: 200, description: 'Dueño creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al crear el dueño' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.RECEPCIONISTA, EUserRole.SUPERADMIN)
  async createOwner(@Body() owner: OwnerForCreationDto): Promise<OwnerResponse> {
    return await this.ownersService.createOwner(owner);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar dueños y sus mascotas' })
  @ApiResponse({ status: 200, description: 'Dueños encontrados exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al buscar los dueños' })
  @ApiBearerAuth('JWT-auth')
/*   @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.RECEPCIONISTA, EUserRole.SUPERADMIN) */
  async searchOwners(@Query() query: MetaQueryDto): Promise<PaginatedResponse<OwnerResponse>> {
    return await this.ownersService.searchOwners(query);
  }

  @Patch('update')
  @ApiOperation({ summary: 'Actualizar un dueño' })
  @ApiResponse({ status: 200, description: 'Dueño actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al actualizar el dueño' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.RECEPCIONISTA, EUserRole.SUPERADMIN)
  async updateOwner(@Body() owner: OwnerForUpdateDto): Promise<OwnerResponse> {
    return await this.ownersService.updateOwner(owner);
  }
}
