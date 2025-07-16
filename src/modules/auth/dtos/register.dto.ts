import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { EUserRole } from "generated/prisma";

export class RegisterDto{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsEnum(EUserRole)
  @IsNotEmpty()
  role: EUserRole;
}