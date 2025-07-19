import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ClinicalServiceForCreationDto } from '../dto/clinicalServiceForCreationDto.dto';
import { ClinicalServiceResponse } from '../dto/clinical-service.response';
import { ClinicalService } from 'generated/prisma';
import { clinicalServiceToClinicalServiceResponse } from 'src/common/mappers/clinical-service.mappers';

@Injectable()
export class ClinicalServicesService {
  
  constructor(private readonly prisma: PrismaService) {}

  async createClinicalService(request: ClinicalServiceForCreationDto): Promise<ClinicalServiceResponse> {
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

  async getClinicalServiceByName(name: string): Promise<ClinicalService |  null> {
    return this.prisma.clinicalService.findUnique({
      where: {
        name: name,
      },
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
