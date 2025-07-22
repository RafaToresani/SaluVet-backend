import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class MedicalRecordForCreationDto {
  @ApiProperty({ description: 'El ID de la cita', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  appointmentId: string;

  @ApiProperty({ description: 'El diagnóstico', example: 'El paciente tiene una fiebre' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiProperty({ description: 'El tratamiento', example: 'Se le dio un medicamento' })
  @IsOptional()
  @IsString()
  treatment?: string;

  @ApiProperty({ description: 'Las notas', example: 'El paciente tiene una fiebre' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Las vacunas', example: [{ name: 'Vacuna contra la gripe' }] })
  @IsOptional()
  @IsArray()
  @Type(() => VaccineForCreationDto)
  vaccines?: VaccineForCreationDto[];
}

export class VaccineForCreationDto {
  @ApiProperty({ description: 'El nombre de la vacuna', example: 'Vacuna contra la gripe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'La descripción de la vacuna', example: 'Vacuna contra la gripe' })
  @IsOptional()
  @IsString()
  description?: string;
}