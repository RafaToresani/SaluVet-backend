import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ClinicalServiceForCreationDto } from '../dto/clinicalServiceForCreationDto.dto';
import { ClinicalServiceResponse } from '../dto/clinical-service.response';
import { ClinicalService } from 'generated/prisma';
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
    if (existsByName) {
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

  async getClinicalServiceById(id: string): Promise<ClinicalService | null> {
    return this.prisma.clinicalService.findUnique({
      where: { id: id },
    });
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
}
