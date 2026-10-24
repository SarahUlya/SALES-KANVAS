import { Module } from '@nestjs/common';
import { MutasiBatchService } from './mutasi-batch.service';
import { MutasiBatchController } from './mutasi-batch.controller';

@Module({
  controllers: [MutasiBatchController],
  providers: [MutasiBatchService],
})
export class MutasiBatchModule {}
