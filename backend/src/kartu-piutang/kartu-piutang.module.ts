
import { Module } from '@nestjs/common';
import { KartuPiutangOutletService } from './kartu-piutang.service';
import { KartuPiutangOutletController } from './kartu-piutang.controller';

@Module({
  controllers: [KartuPiutangOutletController],
  providers: [KartuPiutangOutletService],
})
export class KartuPiutangModule {}
