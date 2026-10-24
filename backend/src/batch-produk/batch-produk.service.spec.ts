import { Test, TestingModule } from '@nestjs/testing';
import { BatchProdukService } from './batch-produk.service';

describe('BatchProdukService', () => {
  let service: BatchProdukService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatchProdukService],
    }).compile();

    service = module.get<BatchProdukService>(BatchProdukService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
