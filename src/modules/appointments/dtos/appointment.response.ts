import { Appointment, EAppointmentStatus } from "generated/prisma";
import { ClinicalServiceResponse } from "src/modules/clinical-services/dto/clinical-service.response";
import { OwnerResponse } from "src/modules/owners/dtos/owner.response";
import { PetResponse } from "src/modules/pets/dtos/pet.response";

export class AppointmentResponse{
  id: string;
  vetId: string;
  vetName: string;
  owner: OwnerResponse;
  pet: PetResponse;
  description?: string;
  date: Date;
  status: EAppointmentStatus;
  services: ClinicalServiceResponse[];
  startTime: number;
  endTime: number;
  duration: number;
  extraTime: number;
  extraTimeReason?: string;
  extraPrice?: number;
  extraPriceReason?: string;
  totalPrice: number;
}

