import { EPetSpecies, EPetGender } from 'generated/prisma';
import { PetForCreationDto } from 'src/modules/pets/dtos/petForCreationDto.dto';
import { PetForUpdateDto } from 'src/modules/pets/dtos/petForUpdateDto.dto';

export const petMock = {
  id: '123',
  name: 'Buddy',
  birthdate: new Date('2020-01-01'),
  species: EPetSpecies.PERRO,
  breed: 'Labrador',
  gender: EPetGender.MACHO,
  ownerId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const petCreateDto: PetForCreationDto = {
  ownerId: '1',
  name: 'Buddy',
  birthdate: new Date('2020-01-01'),
  species: EPetSpecies.PERRO,
  breed: 'Labrador',
  gender: EPetGender.MACHO,
};

export const petUpdateDto: PetForUpdateDto = {
  id: '123',
  name: 'Lola',
  birthdate: new Date('2020-01-02'),
  species: EPetSpecies.GATO,
  breed: 'Mestiza',
  gender: EPetGender.HEMBRA,
};
