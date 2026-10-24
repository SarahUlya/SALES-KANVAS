import { Module } from '@nestjs/common';
import { KasbonService } from './kasbon.service';
import { KasbonController } from './kasbon.controller';

@Module({
  controllers: [KasbonController],
  providers: [KasbonService],
})
export class KasbonModule {}
