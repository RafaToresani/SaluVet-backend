import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { EUserRole } from "generated/prisma";

export class GetUsersQueryDto {
  @IsOptional()
  @IsEnum(EUserRole)
  @ApiPropertyOptional({ enum: EUserRole })
  role?: EUserRole;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  email?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name?: string;
}