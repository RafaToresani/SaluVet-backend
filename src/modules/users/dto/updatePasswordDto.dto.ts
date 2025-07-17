import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class UpdatePasswordDto {
  @IsString()
  @ApiProperty({ example: 'password', description: 'The old password of the user' })
  oldPassword: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ example: 'password', description: 'The new password of the user' })
  newPassword: string;
}