import { Appointment, ClinicalService, Owner, Pet, User } from "generated/prisma";
import { AppointmentResponse } from "src/modules/appointments/dtos/appointment.response";
import { ownerToResponse } from "./owner.mappers";
import { petToPetResponse } from "./pet.mapper";
import { clinicalServiceToClinicalServiceResponse } from "./clinical-service.mappers";

export function appointmentToAppointmentResponse(appointment: Appointment & {
  vet: User;
  pet: Pet & { owner: Owner };
  services: {
    clinicalService: ClinicalService;
  }[];
}): AppointmentResponse {
  return {
    id: appointment.id,
    vetId: appointment.vetId,
    vetName: appointment.vet.name,
    owner: ownerToResponse(appointment.pet.owner),
    pet: petToPetResponse(appointment.pet),
    description: appointment.description ?? undefined,
    date: appointment.date,
    status: appointment.status,
    services: appointment.services.map(s => clinicalServiceToClinicalServiceResponse(s.clinicalService)),
    startTime: appointment.startTime,
    endTime: appointment.startTime + appointment.duration,
    duration: appointment.duration,
    extraTime: appointment.extraTime ?? 0,
    extraTimeReason: appointment.extraTimeReason ?? undefined,
    extraPrice: appointment.extraPrice ?? 0,
    extraPriceReason: appointment.extraPriceReason ?? undefined,
    totalPrice: appointment.totalPrice,
  };
}
