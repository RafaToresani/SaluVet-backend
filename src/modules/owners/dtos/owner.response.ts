import { PetResponse } from "src/modules/pets/dtos/pet.response";

export interface OwnerResponse {
  id: string;
  name: string;
  lastname: string;
  dni: string;
  email?: string;
  phone: string;
  address: string;
  pets?: PetResponse[];
}