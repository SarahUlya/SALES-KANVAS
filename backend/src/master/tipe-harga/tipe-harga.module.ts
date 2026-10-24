import { Module } from '@nestjs/common';
import { TipeHargaService } from './tipe-harga.service';
import { TipeHargaController } from './tipe-harga.controller';

@Module({
  controllers: [TipeHargaController],
  providers: [TipeHargaService],
})
export class TipeHargaModule {}
