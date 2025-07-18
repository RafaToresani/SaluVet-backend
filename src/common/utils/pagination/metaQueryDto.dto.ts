import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class MetaQueryDto {
  @ApiPropertyOptional({ description: 'Término de búsqueda' })
  @IsOptional()
  @IsString()
  searchTerm?: string;
  
  @ApiPropertyOptional({
    description: 'El número de página',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'El tamaño de la página',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number;
  
  @ApiPropertyOptional({
    description: 'El orden de los resultados',
  })
  @IsOptional()
  @IsEnum(SortOrder)
  @Type(() => String)
  sort?: SortOrder;
}
