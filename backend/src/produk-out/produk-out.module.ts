import { Module } from '@nestjs/common';
import { ProdukOutService } from './produk-out.service';
import { ProdukOutController } from './produk-out.controller';

@Module({
  controllers: [ProdukOutController],
  providers: [ProdukOutService],
})
export class ProdukOutModule {}
