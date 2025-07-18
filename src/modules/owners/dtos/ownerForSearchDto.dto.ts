import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { MetaQueryDto } from "src/common/utils/pagination/metaQueryDto.dto";

export class OwnerForSearchDto {
  @ApiPropertyOptional({
    description: 'El término de búsqueda',
  })
  @IsOptional()
  @IsString()
  searchTerm?: string;
  
  @ApiPropertyOptional({
    description: 'El tamaño de la página',
  })
  @IsOptional()
  @Type(() => MetaQueryDto)
  metaQuery?:MetaQueryDto;
}