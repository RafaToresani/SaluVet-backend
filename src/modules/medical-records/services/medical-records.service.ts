import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { MedicalRecordForCreationDto, VaccineForCreationDto } from '../dtos/medicalRecordForCreationDto.dto';
import { MedicalRecordResponse } from '../dtos/medical-record.response';
import { AppointmentsService } from 'src/modules/appointments/services/appointments.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { PetsService } from 'src/modules/pets/services/pets.service';
import { MedicalRecordForUpdateDto } from '../dtos/medicalRecordForUpdateDto.dto';
import { Appointment, MedicalRecords, User } from 'generated/prisma';
import { VaccineForUpdateDto } from '../dtos/vaccineForUpdateDto.dto';
import { medicalRecordsToResponse } from 'src/common/mappers/medical-records.mappers';

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
  
  async updateMedicalRecord(
    vetId: string,
    medicalRecordForUpdateDto: MedicalRecordForUpdateDto,
  ): Promise<void> {
    const { id, diagnosis, treatment, notes } = medicalRecordForUpdateDto;

    const medicalRecord = await this.findMedicalRecordById(id);
    if(!medicalRecord) throw new NotFoundException('El historial médico no existe');

    if(medicalRecord.vetId !== vetId) throw new UnauthorizedException('Veterinario no autorizado para actualizar el historial médico');

    const diagnosisToUpdate = diagnosis || medicalRecord.diagnosis;
    const treatmentToUpdate = treatment || medicalRecord.treatment;
    const notesToUpdate = notes || medicalRecord.notes;

    await this.prisma.medicalRecords.update({
      where: { id },
      data: { diagnosis: diagnosisToUpdate, treatment: treatmentToUpdate, notes: notesToUpdate },
    });
  }

  async findMedicalRecordById(id: string): Promise<MedicalRecords| null> {
    const medicalRecord = await this.prisma.medicalRecords.findUnique({
      where: { id },
    });
    return medicalRecord;
  }

  async findMedicalRecordsByPetId(petId: string): Promise<MedicalRecordResponse[]> {
    const pet = await this.petsService.getPetById(petId);
    if(!pet) throw new NotFoundException('La mascota no existe');

    const medicalRecords = await this.prisma.medicalRecords.findMany({
      where: { petId },
      include: {
        vaccines: true,
        appointment: {
          include: {
            vet: true,
          },
        },
      },
    });
    return medicalRecords.map(medicalRecord => medicalRecordsToResponse(medicalRecord, medicalRecord.vaccines, medicalRecord.appointment as Appointment & { vet: User }));
  }

  async createVaccine(userId: string, medicalRecordId: string, vaccineForCreationDto: VaccineForCreationDto) {
    const medicalRecord = await this.findMedicalRecordById(medicalRecordId);
    if(!medicalRecord) throw new NotFoundException('El historial médico no existe');

    if(medicalRecord.vetId !== userId) throw new UnauthorizedException('Veterinario no autorizado para crear la vacuna');

    const vaccine = await this.prisma.vaccines.create({
      data: {
        name: vaccineForCreationDto.name,
        description: vaccineForCreationDto.description || '',
        date: new Date(),
        medicalRecords: {
          connect: { id: medicalRecordId },
        },
      },
    });

    return vaccine;
  }

  async updateVaccine(userId: string,vaccineForUpdateDto: VaccineForUpdateDto) {
    const { id, name, description } = vaccineForUpdateDto;

    const vaccine = await this.prisma.vaccines.findUnique({
      where: { id },
      include: {
        medicalRecords: true,
      },
    });
    if(!vaccine) throw new NotFoundException('La vacuna no existe');
    if(vaccine.medicalRecords.vetId !== userId) throw new UnauthorizedException('Veterinario no autorizado para actualizar la vacuna');

    const nameToUpdate = name || vaccine.name;
    const descriptionToUpdate = description || vaccine.description;

    await this.prisma.vaccines.update({
      where: { id },
      data: { name: nameToUpdate, description: descriptionToUpdate },
    });
  }

  async deleteVaccine(userId: string, vaccineId: string) {
    const vaccine = await this.prisma.vaccines.findUnique({
      where: { id: vaccineId },
      include: {
        medicalRecords: true,
      },
    });
    if(!vaccine) throw new NotFoundException('La vacuna no existe');
    if(vaccine.medicalRecords.vetId !== userId) throw new UnauthorizedException('Veterinario no autorizado para eliminar la vacuna');

    const deletedVaccine = await this.prisma.vaccines.delete({
      where: { id: vaccineId },
    });
    if(!deletedVaccine) throw new NotFoundException('La vacuna no existe');

  }
}
