import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ClinicalServiceForCreationDto {
  @ApiProperty({
    description: 'Nombre del servicio',
    example: 'Consulta de rutina',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descripción del servicio',
    example: 'Consulta de rutina',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Precio del servicio', example: 1000 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Duración del servicio en minutos', example: 30 })
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({ description: 'Estado del servicio', example: true })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
