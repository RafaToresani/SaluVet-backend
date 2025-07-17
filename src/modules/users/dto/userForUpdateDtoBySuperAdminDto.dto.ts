import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { UserForUpdateDto } from "./userForUpdateDto.dto";
import { EUserRole } from "generated/prisma";
import { ApiProperty } from "@nestjs/swagger";

export class UserForUpdateDtoBySuperAdminDto extends UserForUpdateDto {
  @IsEnum(EUserRole)
  @IsOptional()
  @ApiProperty({ example: EUserRole.SUPERADMIN, description: 'The role of the user' })
  role?: EUserRole;
}