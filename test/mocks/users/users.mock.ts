import { EUserRole } from "generated/prisma";

export const userVeterinarioMock = {
  id: '1',
  name: 'Juan',
  email: 'juan@example.com',
  password: '123456',
  role: EUserRole.VETERINARIO,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const userRecepcionistaMock = {
  id: '2',
  name: 'Maria',
  email: 'maria@example.com',
  password: '123456',
  role: EUserRole.RECEPCIONISTA,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const userSuperadminMock = {
  id: '3',
  name: 'Superadmin',
  email: 'superadmin@example.com',
  password: '123456',
  role: EUserRole.SUPERADMIN,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const createUserDtoMock = {
  name: 'Juan',
  email: 'juan@example.com',
  password: '123456',
  role: EUserRole.VETERINARIO,
}

