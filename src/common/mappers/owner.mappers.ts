import { Owner } from "generated/prisma";
import { OwnerResponse } from "src/modules/owners/dtos/owner.response";

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