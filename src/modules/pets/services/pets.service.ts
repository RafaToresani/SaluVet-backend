import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PetForCreationDto } from '../dtos/petForCreationDto.dto';
import { EPetGender, EPetSpecies, Pet, Prisma } from 'generated/prisma';
import { petToPetResponse } from 'src/common/mappers/pet.mapper';
import { PetResponse } from '../dtos/pet.response';
import { PetForUpdateDto } from '../dtos/petForUpdateDto.dto';
import {
  MetaQueryDto,
  SortOrder,
} from 'src/common/utils/pagination/metaQueryDto.dto';
import {
  PaginatedMeta,
  PaginatedResponse,
} from 'src/common/utils/pagination/paginated.response';
import { buildPaginatedResponse } from 'src/common/utils/pagination/buildPaginatedResponse';

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPet(createPetDto: PetForCreationDto): Promise<PetResponse> {
    await this.validateOwnerExists(createPetDto.ownerId);
    if (await this.getPetOwnerByName(createPetDto.name, createPetDto.ownerId)) {
      throw new BadRequestException(
        'El dueño ya tiene un mascota con ese nombre',
      );
    }
    if (createPetDto.birthdate && createPetDto.birthdate > new Date()) {
      throw new BadRequestException(
        'La fecha de nacimiento no puede ser en el futuro',
      );
    }
    const pet = await this.prisma.pet.create({
      data: createPetDto,
      include: {
        owner: true,
      },
    });
    return petToPetResponse(pet);
  }

  async searchPets(
    metaQuery?: MetaQueryDto,
  ): Promise<PaginatedResponse<PetResponse>> {
    const searchTerm = metaQuery?.searchTerm ?? '';
    const page = metaQuery?.page ?? 1;
    const size = metaQuery?.size ?? 10;
    const sort = metaQuery?.sort ?? SortOrder.ASC;

    const where: Prisma.PetWhereInput = {};

    if (searchTerm && searchTerm.trim() !== '') {
      where.OR = [
        { name: { contains: searchTerm } },
        { breed: { contains: searchTerm } },
        { gender: { equals: searchTerm.toUpperCase() as EPetGender } },
        { species: { equals: searchTerm.toUpperCase() as EPetSpecies } },
      ];
    }

    const pets = await this.prisma.pet.findMany({
      where,
      skip: (page - 1) * size,
      take: size,
      orderBy: {
        createdAt: sort,
      }
    });

    const total = await this.prisma.pet.count({ where });

    const meta: PaginatedMeta = {
      total,
      page,
      size,
      sort,
    };

    const petsResponse = pets.map(petToPetResponse);

    return buildPaginatedResponse(petsResponse, meta);
  }

  async getPetById(id: string): Promise<Pet | null> {
    return await this.prisma.pet.findUnique({
      where: { id },
    });
  }

  async updatePet(updatePetDto: PetForUpdateDto): Promise<PetResponse> {
    const { id, ...rest } = updatePetDto;

    const foundPet = await this.getPetById(id);
    if (!foundPet) {
      throw new BadRequestException('La mascota no existe');
    }

    if (updatePetDto.birthdate && updatePetDto.birthdate > new Date()) {
      throw new BadRequestException(
        'La fecha de nacimiento no puede ser en el futuro',
      );
    }

    const data: Partial<PetForUpdateDto> = {};
    for (const key in rest) {
      if (rest[key] !== undefined) {
        data[key] = rest[key];
      }
    }
    const updatedPet = await this.prisma.pet.update({
      where: { id },
      data,
    });

    return petToPetResponse(updatedPet);
  }

  async getPetOwnerByName(name: string, id: string): Promise<Pet | null> {
    return await this.prisma.pet.findFirst({
      where: {
        name,
        ownerId: id,
      },
    });
  }

  async deletePet(id: string): Promise<void> {
    const petToDelete = await this.getPetById(id);
    if (!petToDelete) throw new BadRequestException('La mascota no existe.');
    await this.prisma.pet.delete({
      where: { id },
    });
  }

  async validateOwnerExists(id: string): Promise<void> {
    const owner = await this.prisma.owner.findUnique({
      where: {
        id,
      },
    });
    if (!owner) {
      throw new BadRequestException('El dueño no existe');
    }
  }
}
