import { Appointment, MedicalRecords, User, Vaccines } from "generated/prisma";
import { MedicalRecordResponse } from "src/modules/medical-records/dtos/medical-record.response";
import { VaccineResponse } from "src/modules/medical-records/dtos/vaccine.response";

export function medicalRecordsToResponse(medicalRecord: MedicalRecords, vaccines: Vaccines[], appointment: Appointment & { vet: User }): MedicalRecordResponse {
  return {
    id: medicalRecord.id,
    petId: medicalRecord.petId,
    vetId: medicalRecord.vetId,
    vetName: appointment.vet.name,
    appointmentId: appointment.id,
    diagnosis: medicalRecord.diagnosis || 'No se definió',
    treatment: medicalRecord.treatment || 'No se definió',
    notes: medicalRecord.notes || 'No se definió',
    date: medicalRecord.date,
    vaccines: vaccines.map(vaccine => vaccineToResponse(vaccine)),
  };
}

export function vaccineToResponse(vaccine: Vaccines): VaccineResponse {
  return {
    id: vaccine.id,
    name: vaccine.name,
    description: vaccine.description || 'No se definió',
    date: vaccine.date,
  };
}