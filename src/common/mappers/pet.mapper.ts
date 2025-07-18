import { Pet } from "generated/prisma";
import { PetResponse } from "src/modules/pets/dtos/pet.response";

export function petToPetResponse(pet: Pet): PetResponse {
  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    birthdate: pet.birthdate,
    gender: pet.gender,
  };
}