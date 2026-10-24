import { Test, TestingModule } from '@nestjs/testing';
import { KasbonService } from './kasbon.service';

describe('KasbonService', () => {
  let service: KasbonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KasbonService],
    }).compile();

    service = module.get<KasbonService>(KasbonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
