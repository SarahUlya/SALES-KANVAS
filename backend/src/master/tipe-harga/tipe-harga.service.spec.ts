import { Test, TestingModule } from '@nestjs/testing';
import { TipeHargaService } from './tipe-harga.service';

describe('TipeHargaService', () => {
  let service: TipeHargaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipeHargaService],
    }).compile();

    service = module.get<TipeHargaService>(TipeHargaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
