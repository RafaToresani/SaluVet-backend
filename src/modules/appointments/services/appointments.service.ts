import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { AppointmentForCreationDto } from '../dtos/appointmentForCreationDto.dto';
import { PetsService } from 'src/modules/pets/services/pets.service';
import { UsersService } from 'src/modules/users/services/users.service';
import {
  ClinicalService,
  EAppointmentStatus,
  EUserRole,
  EWeekDay,
  ScheduleConfig,
  ScheduleConfigDay,
} from 'generated/prisma';
import { ClinicalServicesService } from 'src/modules/clinical-services/services/clinical-services.service';
import { ScheduleConfigService } from 'src/modules/schedule/services/schedule-config.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly petsService: PetsService,
    private readonly usersService: UsersService,
    private readonly clinicalServicesService: ClinicalServicesService,
    private readonly scheduleConfigService: ScheduleConfigService,
  ) {}

  async createAppointment(request: AppointmentForCreationDto) {
    const {
      petId,
      vetId,
      description,
      services,
      extraTime,
      extraTimeReason,
      extraPrice,
      extraPriceReason,
      date,
      startTime,
    } = request;

    const pet = await this.petsService.getPetById(petId);
    if (!pet) throw new NotFoundException('Mascota no encontrada');

    const vet = await this.usersService.getUserById(vetId);
    if (!vet) throw new NotFoundException('Veterinario no encontrado');
    if (vet.role !== EUserRole.VETERINARIO)
      throw new BadRequestException('El usuario no es un veterinario');

    let duration = 0;
    let totalPrice = 0;
    if (extraTime) duration += extraTime;
    if (extraPrice) totalPrice += extraPrice;

    const serviceIds = services.map((s) => s.clinicalServiceId);
    const uniqueServiceIds = new Set(serviceIds);

    if (uniqueServiceIds.size !== serviceIds.length) {
      throw new BadRequestException('No se permiten servicios duplicados');
    }

    const clinicalServices: ClinicalService[] = [];
    for (const service of services) {
      const clinicalService =
        await this.clinicalServicesService.getClinicalServiceById(
          service.clinicalServiceId,
        );
      if (!clinicalService)
        throw new NotFoundException('Servicio no encontrado');
      if (!clinicalService.isActive)
        throw new BadRequestException('El servicio no está activo');
      duration += clinicalService.duration;
      totalPrice += clinicalService.price;
      clinicalServices.push(clinicalService);
    }

    const scheduleConfig =
      await this.scheduleConfigService.getScheduleConfigByVetId(vetId);
    if (!scheduleConfig)
      throw new NotFoundException('Configuración de agenda no encontrada');

    if (date < new Date())
      throw new BadRequestException(
        'La fecha de la cita no puede ser en el pasado',
      );

    this.validateAvailability(scheduleConfig, date, startTime, duration);
    await this.validateNoOverlap(vetId, date, startTime, duration);

    const appointment = await this.prisma.$transaction(async (prisma) => {
      const createdAppointment = await prisma.appointment.create({
        data: {
          petId,
          vetId,
          description: description ?? null,
          date,
          startTime,
          duration,
          extraTime: extraTime ?? null,
          extraTimeReason: extraTimeReason ?? null,
          extraPrice: extraPrice ?? null,
          extraPriceReason: extraPriceReason ?? null,
          totalPrice,
          status: EAppointmentStatus.PENDIENTE,
          services: {
            create: clinicalServices.map((cs) => ({
              clinicalServiceId: cs.id,
            })),
          },
        },
        include: {
          services: true,
          pet: true,
          vet: true,
        },
      });

      return createdAppointment;
    });

    return appointment;
  }

  private validateAvailability(
    scheduleConfig: ScheduleConfig & { days: ScheduleConfigDay[] },
    date: Date,
    startTime: number,
    duration: number,
  ) {
    const weekDay = this.getWeekDay(date);

    const dayConfig = scheduleConfig.days.find(
      (day) => day.weekday === weekDay,
    );
    if (!dayConfig)
      throw new NotFoundException('Configuración de agenda no encontrada');

    if (!dayConfig.isActive)
      throw new BadRequestException(
        'El veterinario no está disponible en este día',
      );

    if (startTime < dayConfig.startTime)
      throw new BadRequestException('El horario de inicio no es válido');

    if (startTime + duration > dayConfig.endTime)
      throw new BadRequestException(
        'La duración de la cita supera el horario de fin de la jornada',
      );
  }

  private async validateNoOverlap(
    vetId: string,
    date: Date,
    startTime: number,
    duration: number,
  ) {
    const endTime = startTime + duration;

    const sameDayAppointments = await this.prisma.appointment.findMany({
      where: {
        vetId,
        date,
        status: {
          not: EAppointmentStatus.CANCELADO,
        },
      },
      select: {
        startTime: true,
        duration: true,
      },
    });

    const overlap = sameDayAppointments.some((app) => {
      const appStart = app.startTime;
      const appEnd = app.startTime + app.duration;
      return startTime < appEnd && appStart < endTime;
    });

    if (overlap) {
      throw new BadRequestException(
        'Ya existe un turno que se solapa con el horario solicitado',
      );
    }
  }

  private getWeekDay(date: Date): EWeekDay {
    const jsToEWeekDayMap = [
      EWeekDay.DOMINGO, // 0
      EWeekDay.LUNES, // 1
      EWeekDay.MARTES, // 2
      EWeekDay.MIERCOLES, // 3
      EWeekDay.JUEVES, // 4
      EWeekDay.VIERNES, // 5
      EWeekDay.SABADO, // 6
    ];

    const eWeekDay = jsToEWeekDayMap[date.getDay()];
    return eWeekDay;
  }
}
