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
  Appointment,
  ClinicalService,
  EAppointmentStatus,
  EUserRole,
  EWeekDay,
  Owner,
  Pet,
  ScheduleConfig,
  ScheduleConfigDay,
  User,
} from 'generated/prisma';
import { ClinicalServicesService } from 'src/modules/clinical-services/services/clinical-services.service';
import { ScheduleConfigService } from 'src/modules/schedule/services/schedule-config.service';
import { AppointmentResponse } from '../dtos/appointment.response';
import { appointmentToAppointmentResponse } from 'src/common/mappers/appointments.mappers';
import { RescheduleAppointmentDto } from '../dtos/rescheduleAppointmentDto.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly petsService: PetsService,
    private readonly usersService: UsersService,
    private readonly clinicalServicesService: ClinicalServicesService,
    private readonly scheduleConfigService: ScheduleConfigService,
  ) {}

  async createAppointment(
    request: AppointmentForCreationDto,
  ): Promise<AppointmentResponse> {
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

    if (!appointment) throw new NotFoundException('Error al crear la cita');

    return await this.getAppointmentById(appointment.id);
  }

  async rescheduleAppointment(
    id: string,
    request: RescheduleAppointmentDto,
  ): Promise<AppointmentResponse> {
    const { newDate, newStartTime } = request;
    if (!newDate && !newStartTime)
      throw new BadRequestException('Debe enviar al menos una modificación');

    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        services: {
          include: { clinicalService: true },
        },
      },
    });

    if (!appointment) throw new NotFoundException('Turno no encontrado');

    if (appointment.status === EAppointmentStatus.CANCELADO)
      throw new BadRequestException(
        'No se puede reprogramar un turno cancelado',
      );
    const finalDate = newDate ?? appointment.date;
    const finalStartTime = newStartTime ?? appointment.startTime;
    const vetId = appointment.vetId;
    const duration = appointment.duration;

    if (finalDate < new Date())
      throw new BadRequestException('No se puede reprogramar al pasado');

    const scheduleConfig =
      await this.scheduleConfigService.getScheduleConfigByVetId(vetId);
    if (!scheduleConfig)
      throw new NotFoundException('Configuración de agenda no encontrada');

    this.validateAvailability(
      scheduleConfig,
      finalDate,
      finalStartTime,
      duration,
    );

    await this.validateNoOverlap(
      vetId,
      finalDate,
      finalStartTime,
      duration,
    );

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: {
        date: finalDate,
        startTime: finalStartTime,
      },
      include: {
        vet: true,
        pet: {
          include: {
            owner: true,
          },
        },
        services: {
          include: {
            clinicalService: true,
          },
        },
      },
    });

    if (!updated) throw new NotFoundException('Error al reprogramar la cita');

    return await this.getAppointmentById(updated.id);
  }

  async getAppointmentById(id: string): Promise<AppointmentResponse> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        vet: true,
        pet: {
          include: {
            owner: true,
          },
        },
        services: {
          include: {
            clinicalService: true,
          },
        },
      },
    });
    if (!appointment) throw new NotFoundException('Cita no encontrada');
    return appointmentToAppointmentResponse(
      appointment as Appointment & {
        vet: User;
        pet: Pet & { owner: Owner };
        services: {
          clinicalService: ClinicalService;
        }[];
      },
    );
  }

  async getAppointmentsByDate(dateStr: Date): Promise<AppointmentResponse[]> {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Fecha inválida');
    }
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const appointments = await this.prisma.appointment.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        vet: true,
        pet: {
          include: {
            owner: true,
          },
        },
        services: {
          include: {
            clinicalService: true,
          },
        },
      },
    });
    return appointments.map((appointment) =>
      appointmentToAppointmentResponse(
        appointment as Appointment & {
          vet: User;
          pet: Pet & { owner: Owner };
          services: {
            clinicalService: ClinicalService;
          }[];
        },
      ),
    );
  }

  async updateAppointmentStatus(id: string, status: EAppointmentStatus): Promise<AppointmentResponse> {
    status = status.toUpperCase() as EAppointmentStatus;
    if (!Object.values(EAppointmentStatus).includes(status))
      throw new BadRequestException('Estado inválido');

    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
  
    if (!appointment) throw new NotFoundException('Cita no encontrada');
    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        vet: true,
        pet: { include: { owner: true } },
        services: { include: { clinicalService: true } },
      },
    });

    if (!updated) throw new NotFoundException('Error al actualizar el estado de la cita');

    return await this.getAppointmentById(updated.id);
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
