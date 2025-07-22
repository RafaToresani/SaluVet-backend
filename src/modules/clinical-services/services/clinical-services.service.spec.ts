import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalServicesService } from './clinical-services.service';

describe('ClinicalServicesService', () => {
  let service: ClinicalServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClinicalServicesService],
    }).compile();

    service = module.get<ClinicalServicesService>(ClinicalServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
