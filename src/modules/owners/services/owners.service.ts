import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { OwnerForCreationDto } from '../dtos/ownerForCreationDto.dto';
import { Owner } from 'generated/prisma';
import { OwnerResponse } from '../dtos/owner.response';
import { ownerToResponse } from 'src/common/mappers/owner.mappers';
import { OwnerForUpdateDto } from '../dtos/ownerForUpdateDto.dto';

@Injectable()
export class OwnersService {
  
  constructor(private readonly prisma: PrismaService) {}

  async createOwner(owner: OwnerForCreationDto): Promise<OwnerResponse> {
    if(await this.findOwnerByDni(owner.dni)) throw new BadRequestException('El dni ingresado ya está registrado.');
    if(await this.findOwnerByPhone(owner.phone)) throw new BadRequestException('El teléfono ingresado ya está registrado.');
    
    const newOwner = await this.prisma.owner.create({
      data: owner,
    });

    return ownerToResponse(newOwner);
  }

  async updateOwner(request: OwnerForUpdateDto): Promise<OwnerResponse> {
    const ownerToUpdate = await this.findOwnerById(request.id);
    if(!ownerToUpdate) throw new BadRequestException('El dueño no existe.');

    if(request.dni){
      const ownerWithSameDni = await this.findOwnerByDni(request.dni);
      if(ownerWithSameDni && ownerWithSameDni.id !== request.id) throw new BadRequestException('El dni ingresado ya está registrado.');
    }

    if(request.phone){
      const ownerWithSamePhone = await this.findOwnerByPhone(request.phone);
      if(ownerWithSamePhone && ownerWithSamePhone.id !== request.id) throw new BadRequestException('El teléfono ingresado ya está registrado.');
    }

    const updatedOwner = await this.prisma.owner.update({
      where: { id: request.id },
      data: {
        dni: request.dni || ownerToUpdate.dni,
        phone: request.phone || ownerToUpdate.phone,
        name: request.name || ownerToUpdate.name,
        lastname: request.lastname || ownerToUpdate.lastname,
        email: request.email || ownerToUpdate.email,
        address: request.address || ownerToUpdate.address,
      },
    });

    return ownerToResponse(updatedOwner);
  }

  async findOwnerById(id: string): Promise<Owner | null> {
    return await this.prisma.owner.findUnique({
      where: {
        id,
      },
    });
  }

  async findOwnerByDni(dni: string): Promise<Owner | null> {
    return await this.prisma.owner.findUnique({
      where: {
        dni,
      },
    });
  }

  async findOwnerByPhone(phone: string): Promise<Owner | null> {
    return await this.prisma.owner.findUnique({
      where: {
        phone,
      },
    });
  }
}
