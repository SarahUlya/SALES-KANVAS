import { Test, TestingModule } from '@nestjs/testing';
import { KasbonProdukService } from './kasbon_produk.service';

describe('KasbonProdukService', () => {
  let service: KasbonProdukService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KasbonProdukService],
    }).compile();

    service = module.get<KasbonProdukService>(KasbonProdukService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
