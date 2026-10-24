import { Test, TestingModule } from '@nestjs/testing';
import { ProdukInController } from './produk-in.controller';
import { ProdukInService } from './produk-in.service';

describe('ProdukInController', () => {
  let controller: ProdukInController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdukInController],
      providers: [ProdukInService],
    }).compile();

    controller = module.get<ProdukInController>(ProdukInController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
