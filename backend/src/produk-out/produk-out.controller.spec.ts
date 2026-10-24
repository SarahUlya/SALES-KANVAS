import { Test, TestingModule } from '@nestjs/testing';
import { ProdukOutController } from './produk-out.controller';
import { ProdukOutService } from './produk-out.service';

describe('ProdukOutController', () => {
  let controller: ProdukOutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdukOutController],
      providers: [ProdukOutService],
    }).compile();

    controller = module.get<ProdukOutController>(ProdukOutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
