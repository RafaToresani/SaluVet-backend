import { VaccineResponse } from "./vaccine.response";

export interface MedicalRecordResponse {
  id: string;
  petId: string;
  petName: string
  vetId: string;
  vetName: string;
  appointmentId: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  date: Date;
  vaccines: VaccineResponse[];
}
