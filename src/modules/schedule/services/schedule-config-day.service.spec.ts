import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleConfigDayService } from './schedule-config-day.service';

describe('ScheduleConfigDayService', () => {
  let service: ScheduleConfigDayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleConfigDayService],
    }).compile();

    service = module.get<ScheduleConfigDayService>(ScheduleConfigDayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
