import { Test, TestingModule } from '@nestjs/testing';
import { ProdukInService } from './produk-in.service';

describe('ProdukInService', () => {
  let service: ProdukInService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdukInService],
    }).compile();

    service = module.get<ProdukInService>(ProdukInService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
