
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
import { ProdukInService } from './produk-in.service';
import {
  CreateProdukInDto,
  UpdateProdukInDto,
} from './dto/create-produk-in.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('produk-in')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProdukInController {
  constructor(
    private readonly produkInService: ProdukInService,
  ) {}

  @Post()
  @RequirePermission('produk-in:write')
  @ResponseMessage('Produk In created successfully')
  create(@Body() dto: CreateProdukInDto) {
    return this.produkInService.create(dto);
  }

  @Get()
  @RequirePermission('produk-in:read')
  @ResponseMessage('List Produk In')
  findAll() {
    return this.produkInService.findAll();
  }

  @Get(':id')
  @RequirePermission('produk-in:read')
  @ResponseMessage('Detail Produk In')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.produkInService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission('produk-in:write')
  @ResponseMessage('Produk In updated successfully')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProdukInDto,
  ) {
    return this.produkInService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('produk-in:write')
  @ResponseMessage('Produk In deleted successfully')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.produkInService.remove(id);
  }
}
