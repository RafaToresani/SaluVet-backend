import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class MedicalRecordForUpdateDto {
  @ApiProperty({ description: 'El ID del historial médico', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  id: string;

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
}
