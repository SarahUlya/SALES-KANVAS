
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

import { GudangService } from './gudang.service';
import {
  CreateGudangDto,
  UpdateGudangDto,
} from './dto/create-gudang.dto';

@Controller('master/gudang')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GudangController {
  constructor(private readonly gudangService: GudangService) {}

  @Get()
  @RequirePermission('gudang:read')
  findAll() {
    return this.gudangService.findAll();
  }

  @Get(':id')
  @RequirePermission('gudang:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gudangService.findOne(id);
  }

  @Post()
  @RequirePermission('gudang:write')
  create(
    @Body() dto: CreateGudangDto,
    @CurrentUser() user: AuthenticatedUser,
    @Ip() ip: string,
  ) {
    return this.gudangService.create(dto, user.id_user, ip);
  }

  @Patch(':id')
  @RequirePermission('gudang:write')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGudangDto,
    @CurrentUser() user: AuthenticatedUser,
    @Ip() ip: string,
  ) {
    return this.gudangService.update(id, dto, user.id_user, ip);
  }

  @Delete(':id')
  @RequirePermission('gudang:write')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gudangService.remove(id);
  }
}
