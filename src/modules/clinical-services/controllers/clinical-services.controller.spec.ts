import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalServicesController } from './clinical-services.controller';

describe('ClinicalServicesController', () => {
  let controller: ClinicalServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicalServicesController],
    }).compile();

    controller = module.get<ClinicalServicesController>(ClinicalServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
