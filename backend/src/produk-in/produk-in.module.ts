import { Module } from '@nestjs/common';
import { ProdukInService } from './produk-in.service';
import { ProdukInController } from './produk-in.controller';

@Module({
  controllers: [ProdukInController],
  providers: [ProdukInService],
})
export class ProdukInModule {}
