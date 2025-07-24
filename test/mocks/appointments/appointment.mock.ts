import { EAppointmentStatus } from "generated/prisma"
import { clinicalServiceMock } from "../clinical-services/clinical-services.mock"
import { petMock } from "../pets/pets.mock";
import { userVeterinarioMock } from "../users/users.mock";

export const appointmentClinicalServiceMock = {
  id: '1',
  appointmentId: '1',
  clinicalServiceId: '1',
  clinicalService: clinicalServiceMock,
  createdAt: new Date(),
  updatedAt: new Date(),
}


export const appointmentMock = {
  id: '1',
  petId: petMock.id,
  pet: petMock,
  vetId: userVeterinarioMock.id,
  vet: userVeterinarioMock,
  description: 'Description',
  services: [appointmentClinicalServiceMock],
  extraTime: 10,
  extraPrice: 100,
  extraPriceReason: 'Reason',
  extraTimeReason: 'Reason',
  date: new Date('2026-01-01'),
  startTime: 10,
  duration: 0,
  totalPrice: 100,
  status: EAppointmentStatus.PENDIENTE,
  cancelReason: 'Reason',
  medicalRecords: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const appointmentDtoMock = {
  petId: '1',
  vetId: '1',
  description: 'Consulta general',
  services: [{ clinicalServiceId: '1' }],
  extraTime: 10,
  extraPrice: 100,
  extraTimeReason: 'Demora extra',
  extraPriceReason: 'Material adicional',
  date: new Date('2026-01-06'), 
  startTime: 500, 
};
