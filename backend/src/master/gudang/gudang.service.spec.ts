import { Test, TestingModule } from '@nestjs/testing';
import { GudangService } from './gudang.service';

describe('GudangService', () => {
  let service: GudangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GudangService],
    }).compile();

    service = module.get<GudangService>(GudangService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
