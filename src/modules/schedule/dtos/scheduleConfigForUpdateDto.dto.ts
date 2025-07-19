import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { EWeekDay } from "generated/prisma";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class ScheduleConfigDayForUpdateDto {
  @ApiProperty({
    enum: EWeekDay,
    description: 'Día de la semana',
    example: EWeekDay.LUNES,
  })
  @IsEnum(EWeekDay)
  weekday: EWeekDay;

  @ApiProperty({
    description: 'Indica si el día está activo',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Hora de inicio, en minutos desde las 00:00',
    example: 480,
  })
  @IsOptional()
  @IsNumber()
  startTime?: number;

  @ApiProperty({
    description: 'Hora de fin, en minutos desde las 00:00',
    example: 1080,
  })
  @IsOptional()
  @IsNumber()
  endTime?: number;
}

export class ScheduleConfigForUpdateDto {
  @ApiProperty({
    description: 'Días de la semana y horarios disponibles',
    type: [ScheduleConfigDayForUpdateDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleConfigDayForUpdateDto)
  days?: ScheduleConfigDayForUpdateDto[];
}