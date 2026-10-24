import { Module } from '@nestjs/common';
import { ProdukHargaService } from './produk-harga.service';
import { ProdukHargaController } from './produk-harga.controller';

@Module({
  controllers: [ProdukHargaController],
  providers: [ProdukHargaService],
})
export class ProdukHargaModule {}
