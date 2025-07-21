import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

export class RescheduleAppointmentDto {
  @ApiProperty({ example: '2025-08-05', description: 'Nueva fecha' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  newDate?: Date;

  @ApiProperty({ example: 600, description: 'Nuevo horario de inicio (en minutos)' })
  @IsInt()
  @Min(0)
  @Max(1440)
  @IsOptional()
  newStartTime?: number;
}
