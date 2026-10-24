import { Module } from '@nestjs/common';
import { BatchProdukService } from './batch-produk.service';
import { BatchProdukController } from './batch-produk.controller';

@Module({
  controllers: [BatchProdukController],
  providers: [BatchProdukService],
})
export class BatchProdukModule {}
