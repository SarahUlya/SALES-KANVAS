import { Test, TestingModule } from '@nestjs/testing';
import { ProdukHargaService } from './produk-harga.service';

describe('ProdukHargaService', () => {
  let service: ProdukHargaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdukHargaService],
    }).compile();

    service = module.get<ProdukHargaService>(ProdukHargaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
