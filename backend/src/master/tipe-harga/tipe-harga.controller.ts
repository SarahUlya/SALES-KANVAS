
import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { PermissionsGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';

import { TipeHargaService } from './tipe-harga.service';
import {
  CreateTipeHargaDto,
  UpdateTipeHargaDto,
} from './dto/create-tipe-harga.dto';

@Controller('master/tipe-harga')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TipeHargaController {
  constructor(private readonly tipeHargaService: TipeHargaService) {}

  @Get()
  @RequirePermission('tipe-harga:read')
  findAll() {
    return this.tipeHargaService.findAll();
  }

  @Get(':id')
  @RequirePermission('tipe-harga:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipeHargaService.findOne(id);
  }

  @Post()
  @RequirePermission('tipe-harga:write')
  create(
    @Body() dto: CreateTipeHargaDto,
    @CurrentUser() user: AuthenticatedUser,
    @Ip() ip: string,
  ) {
    return this.tipeHargaService.create(dto, user.id_user, ip);
  }

  @Patch(':id')
  @RequirePermission('tipe-harga:write')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTipeHargaDto,
    @CurrentUser() user: AuthenticatedUser,
    @Ip() ip: string,
  ) {
    return this.tipeHargaService.update(id, dto, user.id_user, ip);
  }

  @Delete(':id')
  @RequirePermission('tipe-harga:write')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipeHargaService.remove(id);
  }
}
