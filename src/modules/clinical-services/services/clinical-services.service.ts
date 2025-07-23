import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ClinicalServiceForCreationDto } from '../dto/clinicalServiceForCreationDto.dto';
import { ClinicalServiceResponse } from '../dto/clinical-service.response';
import { ClinicalService, EUserRole } from 'generated/prisma';
import { clinicalServiceToClinicalServiceResponse } from 'src/common/mappers/clinical-service.mappers';
import { ClinicalServiceForUpdateDto } from '../dto/clinicalServiceForUpdateDto.dto';

@Injectable()
export class ClinicalServicesService {

  
  constructor(private readonly prisma: PrismaService) {}

  async createClinicalService(
    request: ClinicalServiceForCreationDto,
  ): Promise<ClinicalServiceResponse> {
    const clinicalService = await this.getClinicalServiceByName(request.name);
    if (clinicalService) {
      throw new BadRequestException('El servicio ya existe');
    }
    const newClinicalService = await this.prisma.clinicalService.create({
      data: {
        name: request.name,
        description: request.description,
        price: request.price,
        duration: request.duration,
        isActive: request.isActive,
      },
    });

    await this.initializeClinicalServiceUser(newClinicalService.id);

    return clinicalServiceToClinicalServiceResponse(newClinicalService);
  }

  async getAllClinicalServices(): Promise<ClinicalServiceResponse[]> {
    const clinicalServices = await this.prisma.clinicalService.findMany();
    return clinicalServices.map(clinicalServiceToClinicalServiceResponse);
  }


  async getClinicalServiceByName(
    name: string,
  ): Promise<ClinicalService | null> {
    return this.prisma.clinicalService.findUnique({
      where: {
        name: name,
      },
    });
  }

  async updateClinicalService(
    request: ClinicalServiceForUpdateDto,
  ): Promise<ClinicalServiceResponse> {
    const clinicalService = await this.getClinicalServiceById(request.id);
    if (!clinicalService) {
      throw new BadRequestException('El servicio no existe');
    }

    const existsByName = await this.getClinicalServiceByName(request.name!);
    if (existsByName && existsByName.id !== request.id) {
      throw new BadRequestException(
        'El nombre del servicio no está disponible',
      );
    }

    const dataToUpdate: Partial<ClinicalService> = {};
    if (request.name !== undefined) dataToUpdate.name = request.name;
    if (request.description !== undefined)
      dataToUpdate.description = request.description;
    if (request.price !== undefined) dataToUpdate.price = request.price;
    if (request.duration !== undefined)
      dataToUpdate.duration = request.duration;
    if (request.isActive !== undefined)
      dataToUpdate.isActive = request.isActive;

    const updatedClinicalService = await this.prisma.clinicalService.update({
      where: { id: clinicalService.id },
      data: dataToUpdate,
    });

    return clinicalServiceToClinicalServiceResponse(updatedClinicalService);
  }

  async deleteClinicalService(id: string): Promise<void> {
    const clinicalService = await this.getClinicalServiceById(id);
    if (!clinicalService) {
      throw new BadRequestException('El servicio no existe');
    }
    await this.prisma.clinicalService.delete({
      where: { id: clinicalService.id },
    });
    return;
  }

  async getClinicalServiceById(id: string): Promise<ClinicalService | null> {
    return this.prisma.clinicalService.findUnique({
      where: { id: id },
    });
  }

  async toggleUserClinicalService(userId: string, clinicalServiceId: string) {
    const userClinicalService = await this.prisma.userClinicalService.findUnique({
      where: {
        userId_clinicalServiceId: {
          userId,
          clinicalServiceId,
        },
      },
    });
    console.log('userClinicalService:', userClinicalService);
    if (!userClinicalService) throw new BadRequestException('El veterinario no tiene habilitado este servicio');
    const newIsActive = !userClinicalService.isActive;
    const updated = await this.prisma.userClinicalService.update({
      where: {
        userId_clinicalServiceId: {
          userId,
          clinicalServiceId,
        },
      },
      data: {
        isActive: newIsActive,
      },
    });
  
    return updated;
  }
  

  async count(): Promise<number> {
    return this.prisma.clinicalService.count();
  }

  async bulkCreate(services: ClinicalServiceForCreationDto[]): Promise<void> {
    await this.prisma.clinicalService.createMany({
      data: services,
    });

    console.log('Servicios creados exitosamente');
  }

  async initializeUserClinicalServices(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('El usuario no existe');
  
    const clinicalServices = await this.prisma.clinicalService.findMany({
      where: { isActive: true },
    });
  
    const relations = clinicalServices.map(service => ({
      userId,
      clinicalServiceId: service.id,
      isActive: false, 
    }));
  
    await this.prisma.userClinicalService.createMany({
      data: relations,
      skipDuplicates: true,
    });
  }
  
  async initializeClinicalServiceUser(clinicalServiceId: string) {
    const clinicalService = await this.getClinicalServiceById(clinicalServiceId);
    if (!clinicalService) throw new BadRequestException('El servicio no existe');

    const users = await this.prisma.user.findMany({
      where: { role: EUserRole.VETERINARIO },
    });

    const relations = users.map(user => ({
      userId: user.id,
      clinicalServiceId: clinicalServiceId,
      isActive: false,
    }));

    await this.prisma.userClinicalService.createMany({
      data: relations,
      skipDuplicates: true,
    });
  }
}
