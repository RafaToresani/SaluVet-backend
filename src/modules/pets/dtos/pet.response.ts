import { EPetGender, EPetSpecies } from "generated/prisma";

export class PetResponse {
  id: string;
  name: string;
  species: EPetSpecies;
  breed: string;
  birthdate: Date;
  gender: EPetGender;
}