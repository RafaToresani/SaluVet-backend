import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UserForUpdateDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  name?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'example@example.com', description: 'The email of the user' })
  email?: string;
}