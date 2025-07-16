import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';
import { RegisterDto } from '../dtos/register.dto';
import { User } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/login.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ){}

  async login(loginDto: LoginDto){
    const user = await this.usersService.findByEmail(loginDto.email);
    if(!user) throw new UnauthorizedException('Credenciales incorrectas');
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if(!isPasswordValid) throw new UnauthorizedException('Credenciales incorrectas');
    return {
      message: 'Login exitoso',
      accessToken: this.generateToken(user),
    }
  }

  async register(registerDto: RegisterDto){
    const user = await this.usersService.createUser(registerDto.name, registerDto.email, registerDto.password, registerDto.role);
    return {
      message: 'Usuario creado correctamente',
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
