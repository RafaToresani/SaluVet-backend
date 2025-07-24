import { userVeterinarioMock } from "../users/users.mock";

export const clinicalServiceMock = {
  id: '1',
  name: 'Servicio 1',
  description: 'Descripción del servicio 1',
  price: 100,
  duration: 30,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const createClinicalServiceDtoMock = {
  name: 'Servicio 1',
  description: 'Descripción del servicio 1',
  price: 100,
  duration: 30,
  isActive: true,
}

export const updateClinicalServiceDtoMock = {
  id: '1',
  name: 'Consulta modificada',
  description: 'Descripción actualizada',
  price: 500,
  duration: 45,
  isActive: true,
};

export const userClinicalServiceMock = {
  id: '1',
  userId: '1',
  clinicalServiceId: '1',
  isActive: true,
  user: userVeterinarioMock,
  clinicalService: clinicalServiceMock,
}