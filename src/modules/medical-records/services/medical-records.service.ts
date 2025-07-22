import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { MedicalRecordForCreationDto } from '../dtos/medicalRecordForCreationDto.dto';
import { MedicalRecordResponse } from '../dtos/medical-record.response';
import { AppointmentsService } from 'src/modules/appointments/services/appointments.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { PetsService } from 'src/modules/pets/services/pets.service';

@Injectable()
export class MedicalRecordsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly petsService: PetsService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  async createMedicalRecord(
    vetId: string,
    medicalRecordForCreationDto: MedicalRecordForCreationDto,
  ): Promise<void> {
    const { appointmentId, diagnosis, treatment, notes, vaccines } = medicalRecordForCreationDto;
  
    const appointment = await this.appointmentsService.getAppointmentById(appointmentId);
    if (!appointment) throw new NotFoundException('Cita no encontrada');
  
    const pet = await this.petsService.getPetById(appointment.petId);
    if (!pet) throw new NotFoundException('Mascota no encontrada');
  
    const vet = await this.usersService.getUserById(vetId);
    if (!vet) throw new NotFoundException('Veterinario no encontrado');
  
    if (appointment.vetId !== vetId)
      throw new UnauthorizedException('Veterinario no autorizado para crear el historial médico');
  
    const foundMedicalRecord = await this.prisma.medicalRecords.findFirst({
      where: {
        appointmentId,
      },
    });
    if (foundMedicalRecord) throw new BadRequestException('El historial médico ya existe');

    const medicalRecord = await this.prisma.$transaction(async (tx) => {
      const newMedicalRecord = await tx.medicalRecords.create({
        data: {
          appointmentId,
          petId: appointment.petId,
          vetId,
          diagnosis: diagnosis || '',
          treatment: treatment || '',
          notes: notes || '',
          date: new Date(),
          vaccines: {
            create: vaccines?.map((vaccine) => ({
              name: vaccine.name,
              description: vaccine.description,
              date: new Date(),
            })),
          },
        },
        include: {
          vaccines: true,
        },
      });
  
      return newMedicalRecord;
    });
  
  }
  
}
