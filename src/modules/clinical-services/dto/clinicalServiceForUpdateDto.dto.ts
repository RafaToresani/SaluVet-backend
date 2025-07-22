import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ClinicalServiceForUpdateDto {
  @ApiProperty({
    description: 'ID del servicio',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Nombre del servicio',
    example: 'Consulta de rutina',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Descripción del servicio',
    example: 'Consulta de rutina',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Precio del servicio', example: 1000 })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'El precio del servicio debe ser mayor a 0' })
  price?: number;

  @ApiProperty({ description: 'Duración del servicio en minutos', example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'La duración del servicio debe ser mayor a 0' })
  duration?: number;

  @ApiProperty({ description: 'Estado del servicio', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
