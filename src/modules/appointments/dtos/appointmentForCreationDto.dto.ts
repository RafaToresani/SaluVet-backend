import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max } from "class-validator";

export class AppointmentForCreationDto {
  @ApiProperty({
    description: 'id de la mascota',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  petId: string;

  @ApiProperty({
    description: 'id del veterinario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  vetId: string;

  @ApiProperty({
    description: 'descripcion de la cita',
    example: 'cita de prueba',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'servicios de la cita',
    example: [{ clinicalServiceId: '123e4567-e89b-12d3-a456-426614174000' }],
  })
  @IsNotEmpty()
  @IsArray()
  services: AppointmentServicesForCreationDto[];

  @ApiProperty({
    description: 'tiempo de agregado opcional para la cita',
    example: 10,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El tiempo extra debe ser un número' })
  @IsPositive({ message: 'El tiempo extra debe ser un número positivo' })
  extraTime?: number;

  @ApiProperty({
    description: 'razon de agregado opcional para la cita',
    example: 'cita de prueba',
  })
  @IsOptional()
  @IsString()
  extraTimeReason?: string;

  @ApiProperty({
    description: 'precio de agregado opcional para la cita',
    example: 10,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El precio extra debe ser un número' })
  @IsPositive({ message: 'El precio extra debe ser un número positivo' })
  extraPrice?: number;

  @ApiProperty({
    description: 'razon de agregado opcional para la cita',
    example: 'cita de prueba',
  })
  @IsOptional()
  @IsString()
  extraPriceReason?: string;

  @ApiProperty({
    description: 'fecha de la cita',
    example: '2025-01-01',
  })
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'hora de inicio de la cita en minutos',
    example: 600, // en minutos
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'La hora de inicio debe ser un número' })
  @IsPositive({ message: 'La hora de inicio debe ser un número positivo' })
  @Max(1440, { message: 'La hora de inicio debe ser menor a 24 horas' })
  startTime: number;
}

export class AppointmentServicesForCreationDto {
  @ApiProperty({
    description: 'id del servicio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  clinicalServiceId: string;
}