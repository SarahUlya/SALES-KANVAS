
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';

import { KartuPiutangOutletService } from './kartu-piutang.service';
import {
  CreateKartuPiutangOutletDto,
  UpdateKartuPiutangOutletDto,
} from './dto/create-kartu-piutang.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('kartu-piutang')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class KartuPiutangOutletController {
  constructor(
    private readonly kartuPiutangOutletService: KartuPiutangOutletService,
  ) {}

  @Post()
  @RequirePermission('kartu-piutang:write')
  @ResponseMessage('Kartu piutang created successfully')
  create(@Body() dto: CreateKartuPiutangOutletDto) {
    return this.kartuPiutangOutletService.create(dto);
  }

  @Get()
  @RequirePermission('kartu-piutang:read')
  @ResponseMessage('List Kartu Piutang')
  findAll() {
    return this.kartuPiutangOutletService.findAll();
  }

  @Get(':id')
  @RequirePermission('kartu-piutang:read')
  @ResponseMessage('Detail Kartu Piutang')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.kartuPiutangOutletService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission('kartu-piutang:write')
  @ResponseMessage('Kartu piutang updated successfully')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateKartuPiutangOutletDto,
  ) {
    return this.kartuPiutangOutletService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('kartu-piutang:write')
  @ResponseMessage('Kartu piutang deleted successfully')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.kartuPiutangOutletService.remove(id);
  }
}
