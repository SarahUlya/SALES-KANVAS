import { Test, TestingModule } from '@nestjs/testing';
import { BatchProdukController } from './batch-produk.controller';
import { BatchProdukService } from './batch-produk.service';

describe('BatchProdukController', () => {
  let controller: BatchProdukController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchProdukController],
      providers: [BatchProdukService],
    }).compile();

    controller = module.get<BatchProdukController>(BatchProdukController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
