import { Test, TestingModule } from '@nestjs/testing';
import { KasbonController } from './kasbon.controller';
import { KasbonService } from './kasbon.service';

describe('KasbonController', () => {
  let controller: KasbonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KasbonController],
      providers: [KasbonService],
    }).compile();

    controller = module.get<KasbonController>(KasbonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
