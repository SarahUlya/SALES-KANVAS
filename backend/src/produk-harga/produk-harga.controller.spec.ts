import { Test, TestingModule } from '@nestjs/testing';
import { ProdukHargaController } from './produk-harga.controller';
import { ProdukHargaService } from './produk-harga.service';

describe('ProdukHargaController', () => {
  let controller: ProdukHargaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdukHargaController],
      providers: [ProdukHargaService],
    }).compile();

    controller = module.get<ProdukHargaController>(ProdukHargaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
