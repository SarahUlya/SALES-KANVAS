import { Test, TestingModule } from '@nestjs/testing';
import { KasbonProdukController } from './kasbon_produk.controller';
import { KasbonProdukService } from './kasbon_produk.service';

describe('KasbonProdukController', () => {
  let controller: KasbonProdukController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KasbonProdukController],
      providers: [KasbonProdukService],
    }).compile();

    controller = module.get<KasbonProdukController>(KasbonProdukController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
