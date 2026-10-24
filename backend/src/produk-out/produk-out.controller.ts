
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Ip,
} from '@nestjs/common';
import { ProdukOutService } from './produk-out.service';
import {
  CreateProdukOutDto,
  UpdateProdukOutDto,
} from './dto/create-produk-out.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('produk-out')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProdukOutController {
  constructor(private readonly produkOutService: ProdukOutService) { }

  @Post()
  @RequirePermission('produk-out:write')
  @ResponseMessage('Produk Out created successfully')
  create(
    @Body() dto: CreateProdukOutDto,
    @CurrentUser() user: AuthenticatedUser,
    @Ip() ip: string,
  ) {
    return this.produkOutService.create(dto, user.id_user, ip);
  }


  @Get()
  @RequirePermission('produk-out:read')
  @ResponseMessage('List Produk Out')
  findAll() {
    return this.produkOutService.findAll();
  }

  @Get(':id')
  @RequirePermission('produk-out:read')
  @ResponseMessage('Detail Produk Out')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.produkOutService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission('produk-out:write')
  @ResponseMessage('Produk Out updated successfully')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProdukOutDto,
    @CurrentUser() user: AuthenticatedUser,
    @Ip() ip: string,
  ) {
    return this.produkOutService.update(id, dto, user.id_user, ip);
  }
}
