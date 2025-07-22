import { ApiProperty, PartialType } from "@nestjs/swagger";
import { VaccineForCreationDto } from "./medicalRecordForCreationDto.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class VaccineForUpdateDto extends PartialType(VaccineForCreationDto) {
  @ApiProperty({ description: 'El ID de la vacuna', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  id: string;
}