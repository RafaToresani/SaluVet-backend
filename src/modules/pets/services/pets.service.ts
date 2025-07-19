import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PetForCreationDto } from '../dtos/petForCreationDto.dto';
import { Pet } from 'generated/prisma';
import { petToPetResponse } from 'src/common/mappers/pet.mapper';
import { PetResponse } from '../dtos/pet.response';
import { PetForUpdateDto } from '../dtos/petForUpdateDto.dto';

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}
  
  async createPet(createPetDto: PetForCreationDto): Promise<PetResponse> {
    await this.validateOwnerExists(createPetDto.ownerId);
    if(await this.getPetOwnerByName(createPetDto.name, createPetDto.ownerId)) {
      throw new BadRequestException('El dueño ya tiene un mascota con ese nombre');
    }
    if(createPetDto.birthdate && createPetDto.birthdate > new Date()) {
      throw new BadRequestException('La fecha de nacimiento no puede ser en el futuro');
    }
    const pet = await this.prisma.pet.create({
      data: createPetDto,
      include: {
        owner: true,
      },
    });
    return petToPetResponse(pet);
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
    
    if(updatePetDto.birthdate && updatePetDto.birthdate > new Date()) {
      throw new BadRequestException('La fecha de nacimiento no puede ser en el futuro');
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
    if(!owner) {
      throw new BadRequestException('El dueño no existe');
    }
  }
}
