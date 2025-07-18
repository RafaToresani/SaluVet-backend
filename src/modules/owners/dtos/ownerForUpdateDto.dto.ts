import { ApiProperty, PartialType } from '@nestjs/swagger';
import { OwnerForCreationDto } from './ownerForCreationDto.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class OwnerForUpdateDto extends PartialType(OwnerForCreationDto) {
  @ApiProperty({
    description: 'ID del dueño',
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}