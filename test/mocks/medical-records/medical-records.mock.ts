import { appointmentMock } from "../appointments/appointment.mock";
import { petMock } from "../pets/pets.mock";
import { userVeterinarioMock } from "../users/users.mock";
import { vaccineDtoMock, vaccineMock } from "./vaccine.mock";

export const medicalRecordsMock = {
  id: '1',
  appointmentId: '1',
  vetId: '1',
  petId: '1',
  diagnosis: 'Diagnóstico',
  treatment: 'Tratamiento',
  notes: 'Notas',
  vaccines: [vaccineMock],
  date: new Date(),
  createdAt: new Date(),
};

export const medicalRecordsDtoMock = {
    appointmentId: appointmentMock.id,
    petId: petMock.id,
    vetId: userVeterinarioMock.id,
    date: new Date(),
    diagnosis: 'Diagnosis',
    treatment: 'Treatment',
    notes: 'Notes',
    vaccines: [vaccineDtoMock],
}

export const medicalRecordsForUpdateDtoMock = {
    medicalRecordsId: medicalRecordsMock.id,
    diagnosis: 'Diagnosis II',
    treatment: 'Treatment II',
    notes: 'Notes II',
}
