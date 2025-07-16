import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';
import { RegisterDto } from '../dtos/register.dto';
import { User } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { AuthResponse } from '../dtos/auth.response';
import { UserResponse } from 'src/modules/users/dto/user.response';


@Injectable()
export class AuthService {
  
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ){}

  async login(loginDto: LoginDto): Promise<AuthResponse>{
    const user = await this.usersService.findByEmail(loginDto.email);
    if(!user) throw new UnauthorizedException('Credenciales incorrectas');
    if(!user.isActive) throw new UnauthorizedException('Usuario no activo');
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if(!isPasswordValid) throw new UnauthorizedException('Credenciales incorrectas');
    return {
      accessToken: await this.generateToken(user),
    }
  }

  async register(registerDto: RegisterDto): Promise<UserResponse>{
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if(existingUser) throw new BadRequestException('El email ya está registrado');
    const user = await this.usersService.createUser(registerDto.name, registerDto.email, registerDto.password, registerDto.role);
    if(!user) throw new BadRequestException('Error al crear el usuario');
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    }
  }

  async generateToken(user: User){
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
