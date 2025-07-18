import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { AuthResponse } from '../dtos/auth.response';
import { RegisterDto } from '../dtos/register.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { EUserRole } from 'generated/prisma';
import { UserResponse } from 'src/modules/users/dto/user.response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse>{
    return this.authService.login(loginDto);
  }

/*   @Post('register')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Roles(EUserRole.SUPERADMIN)
  async register(@Body() registerDto: RegisterDto): Promise<UserResponse>{
    return this.authService.register(registerDto);
  } */
}
