import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { EPetGender, EPetSpecies } from "generated/prisma";

export class PetForCreationDto {
  @ApiProperty({
    description: 'El ID del dueño de la mascota',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  ownerId: string;

  @ApiProperty({
    description: 'El nombre de la mascota',
    example: 'Firulais',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'La especie de la mascota',
    example: EPetSpecies.CANINO,
  })
  @IsNotEmpty()
  @IsEnum(EPetSpecies)
  species: EPetSpecies;

  @ApiProperty({
    description: 'La raza de la mascota',
    example: 'Labrador',
  })
  @IsNotEmpty()
  @IsString()
  breed: string;

  @ApiProperty({
    description: 'La fecha de nacimiento de la mascota',
    example: '2020-01-01',
  })
  @IsNotEmpty()
  @IsDate()
  birthdate: Date;

  @ApiProperty({
    description: 'El género de la mascota',
    example: EPetGender.MACHO,
  })
  @IsNotEmpty()
  @IsEnum(EPetGender)
  gender: EPetGender;
}