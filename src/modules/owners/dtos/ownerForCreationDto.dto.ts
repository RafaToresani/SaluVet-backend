import { IsString, IsEmail, IsOptional, IsNotEmpty, MinLength, MaxLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class OwnerForCreationDto {
  @ApiProperty({
    description: "Nombre del dueño",
    example: "Juan",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: "Apellido del dueño",
    example: "Perez",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastname: string;

  @ApiProperty({
    description: "DNI del dueño",
    example: "12345678",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(10)
  @Matches(/^\d+$/, { message: "El DNI debe contener solo números" })
  dni: string;

  @ApiProperty({
    description: "Email del dueño",
    example: "juan.perez@gmail.com",
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: "Teléfono del dueño",
    example: "1234567890",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(15)
  @Matches(/^\d+$/, { message: "El teléfono debe contener solo números" })
  phone: string;

  @ApiProperty({
    description: "Dirección del dueño",
    example: "Calle Falsa 123",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  address: string;
}