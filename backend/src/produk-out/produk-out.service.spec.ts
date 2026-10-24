import { Test, TestingModule } from '@nestjs/testing';
import { ProdukOutService } from './produk-out.service';

describe('ProdukOutService', () => {
  let service: ProdukOutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdukOutService],
    }).compile();

    service = module.get<ProdukOutService>(ProdukOutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
