import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { RegisterDto } from 'src/modules/auth/dtos/register.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/guards/role.guard';
import { EUserRole } from 'generated/prisma';
import { UserResponse } from '../dto/user.response';
import { GetUsersQueryDto } from '../dto/getUsersQueryDto.dto';
import { UserForUpdateDto } from '../dto/userForUpdateDto.dto';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { UpdatePasswordDto } from '../dto/updatePasswordDto.dto';
import { UserForUpdateDtoBySuperAdminDto } from '../dto/userForUpdateDtoBySuperAdminDto.dto';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Crea un nuevo usuario', description: 'Crea un nuevo usuario. Solo puede hacerlo un superadmin.' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiBody({ type: RegisterDto, description: 'User data' })
  @Post('superadmin/register')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRole.SUPERADMIN)
  createUser(@Body() request:RegisterDto): Promise<UserResponse>{
    return this.usersService.createUser(request);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de usuarios', description: 'Devuelve una lista de usuarios filtrados por rol, email o nombre.' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente', type: Object, isArray: true })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiQuery({ name: 'role', required: false, description: 'Filtrar por rol de usuario' })
  @ApiQuery({ name: 'email', required: false, description: 'Filtrar por email de usuario' })
  @ApiQuery({ name: 'name', required: false, description: 'Filtrar por nombre de usuario' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  getUsers(@Query() query: GetUsersQueryDto): Promise<UserResponse[]>{
    return this.usersService.getUsers(query.role, query.email, query.name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID', description: 'Devuelve la información de un usuario específico por su ID.' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: Object })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  getUser(@Param('id') id: string): Promise<UserResponse>{
    return this.usersService.getUser(id);
  }

  @Patch('superadmin/toggle-active/:id')
  @ApiOperation({ summary: 'Activar/desactivar usuario', description: 'Activa o desactiva el estado de un usuario por su ID. Solo puede hacerlo un superadmin.' })
  @ApiResponse({ status: 200, description: 'Estado de usuario actualizado', type: Object })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRole.SUPERADMIN)
  toggleActive(@Param('id') id: string): Promise<UserResponse>{
    return this.usersService.toggleActive(id);
  }

  @Patch('superadmin/update-user/:id')
  @ApiOperation({ summary: 'Actualizar usuario', description: 'Actualiza la información de un usuario por su ID. Solo puede hacerlo un superadmin.' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado', type: Object })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRole.SUPERADMIN)
  updateUserBySuperadmin(@Param('id') id: string, @Body() request: UserForUpdateDtoBySuperAdminDto): Promise<UserResponse>{
    return this.usersService.updateUserBySuperadmin(id, request);
  }

  @Patch('superadmin/reset-password-by-default/:id')
  @ApiOperation({ summary: 'Cambiar contraseña de usuario', description: 'Cambia la contraseña de un usuario por su ID. Solo puede hacerlo un superadmin.' })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada', type: Object })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRole.SUPERADMIN)
  changePasswordBySuperadmin(@Param('id') id: string): Promise<UserResponse>{
    return this.usersService.changePasswordBySuperadmin(id);
  }

  @Patch('update-my-profile')
  @ApiOperation({ summary: 'Actualizar mi perfil', description: 'Permite al usuario autenticado actualizar su información personal.' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado', type: Object })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiBody({ type: UserForUpdateDto, description: 'Datos para actualizar el usuario' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  updateUser(@UserId() userId: string, @Body() request: UserForUpdateDto): Promise<UserResponse>{
    return this.usersService.updateUser(userId, request);
  }

  @Patch('update-my-password')
  @ApiOperation({ summary: 'Actualizar mi contraseña', description: 'Permite al usuario autenticado actualizar su contraseña.' })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada', type: Object })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiBody({ type: UpdatePasswordDto, description: 'Datos para actualizar la contraseña' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  updatePassword(@UserId() userId: string, @Body() request: UpdatePasswordDto): Promise<UserResponse>{
    return this.usersService.updatePassword(userId, request);
  }
}
