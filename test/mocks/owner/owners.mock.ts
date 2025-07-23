import { MetaQueryDto, SortOrder } from "src/common/utils/pagination/metaQueryDto.dto";
import { petMock } from "../pets/pets.mock";

export const ownerMock = {
  id: '1',
  name: 'Rafa',
  lastname: 'Toresani',
  dni: '1234567890',
  email: 'rtoresani@gmail.com',
  phone: '1234567890',
  address: 'Calle Falsa 123',
  pets: [petMock],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const ownerCreateDto = {
  name: 'Rafa',
  lastname: 'Toresani',
  dni: '1234567890',
  email: 'rtoresani@gmail.com',
  phone: '1234567890',
  address: 'Calle Falsa 123',
}

export const ownerUpdateDto = {
  id: '1',
  dni: '0987654321',
  phone: '5554321',
  name: 'Rafael',
};

export const metaQueryDtoMock: MetaQueryDto = {
  searchTerm: 'rafa',
  page: 1,
  size: 10,
  sort: SortOrder.ASC,
};