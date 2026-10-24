import { Module } from '@nestjs/common';
import { GudangService } from './gudang.service';
import { GudangController } from './gudang.controller';

@Module({
  controllers: [GudangController],
  providers: [GudangService],
})
export class GudangModule {}
