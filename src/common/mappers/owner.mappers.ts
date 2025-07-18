import { Owner, Pet } from "generated/prisma";
import { OwnerResponse } from "src/modules/owners/dtos/owner.response";
import { petToPetResponse } from "./pet.mapper";

export function ownerToResponse(owner: Owner): OwnerResponse {
  return {
    id: owner.id,
    name: owner.name,
    lastname: owner.lastname,
    dni: owner.dni,
    email: owner.email || 'No tiene email',
    phone: owner.phone,
    address: owner.address,
  };
}

export function ownerToResponseWithPets(owner: Owner, pets: Pet[]): OwnerResponse {
  return {
    ...ownerToResponse(owner),
    pets: pets.map(pet => petToPetResponse(pet)),
  };
}