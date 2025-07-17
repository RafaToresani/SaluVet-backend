import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { RegisterDto } from 'src/modules/auth/dtos/register.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/guards/role.guard';
import { EUserRole } from 'generated/prisma';
import { UserResponse } from '../dto/user.response';
import { GetUsersQueryDto } from '../dto/getUsersQueryDto.dto';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiBody({ type: RegisterDto, description: 'User data' })
  @Post('register')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRole.SUPERADMIN)
  createUser(@Body() request:RegisterDto): Promise<UserResponse>{
    return this.usersService.createUser(request);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  getUsers(@Query() query: GetUsersQueryDto): Promise<UserResponse[]>{
    return this.usersService.getUsers(query.role, query.email, query.name);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  getUser(@Param('id') id: string): Promise<UserResponse>{
    return this.usersService.getUser(id);
  }

  @Patch('toggle-active/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRole.SUPERADMIN)
  toggleActive(@Param('id') id: string): Promise<UserResponse>{
    return this.usersService.toggleActive(id);
  }
}
