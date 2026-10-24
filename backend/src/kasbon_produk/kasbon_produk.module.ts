import { Module } from '@nestjs/common';
import { KasbonProdukService } from './kasbon_produk.service';
import { KasbonProdukController } from './kasbon_produk.controller';

@Module({
  controllers: [KasbonProdukController],
  providers: [KasbonProdukService],
})
export class KasbonProdukModule {}
