import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PetForCreationDto } from '../dtos/petForCreationDto.dto';
import { Pet } from 'generated/prisma';
import { petToPetResponse } from 'src/common/mappers/pet.mapper';
import { PetResponse } from '../dtos/pet.response';

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPet(createPetDto: PetForCreationDto): Promise<PetResponse> {
    if(await this.getPetOwnerByName(createPetDto.name, createPetDto.ownerId)) {
      throw new BadRequestException('El dueño ya tiene un mascota con ese nombre');
    }
    const pet = await this.prisma.pet.create({
      data: createPetDto,
      include: {
        owner: true,
      },
    });
    return petToPetResponse(pet);
  }

  async getPetOwnerByName(name: string, id: string): Promise<Pet | null> {
    return await this.prisma.pet.findFirst({
      where: {
        name,
        ownerId: id,
      },
    });
  }
}
