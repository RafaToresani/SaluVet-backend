import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EPetGender, EPetSpecies } from "generated/prisma";

export class PetForUpdateDto{
  @ApiProperty({
    description: 'El ID de la mascota',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'El nombre de la mascota',
    example: 'Firulais',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'La especie de la mascota',
    example: EPetSpecies.PERRO,
  })
  @IsOptional()
  @IsEnum(EPetSpecies)
  species?: EPetSpecies;

  @ApiProperty({
    description: 'La raza de la mascota',
    example: 'Labrador',
  })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiProperty({
    description: 'La fecha de nacimiento de la mascota',
    example: '2020-01-01',
  })
  @IsOptional()
  @IsDate()
  birthdate?: Date;

  @ApiProperty({
    description: 'El género de la mascota',
    example: EPetGender.MACHO,
  })
  @IsOptional()
  @IsEnum(EPetGender)
  gender?: EPetGender;
}