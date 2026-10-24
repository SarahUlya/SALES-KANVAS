import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { ProdukHargaService } from './produk-harga.service';
import { CreateProdukHargaDto } from './dto/create-produk-harga.dto';
import { UpdateProdukHargaDto } from './dto/update-produk-harga.dto';

@Controller('produk-harga')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProdukHargaController {
  constructor(private readonly produkHargaService: ProdukHargaService) {}

  @Post()
  @RequirePermission('produk-harga:write')
  create(@Body() createProdukHargaDto: CreateProdukHargaDto) {
    return this.produkHargaService.create(createProdukHargaDto);
  }

  @Get()
  @RequirePermission('produk-harga:read')
  findAll() {
    return this.produkHargaService.findAll();
  }

  @Get(':id')
  @RequirePermission('produk-harga:read')
  findOne(@Param('id') id: string) {
    return this.produkHargaService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermission('produk-harga:write')
  update(@Param('id') id: string, @Body() updateProdukHargaDto: UpdateProdukHargaDto) {
    return this.produkHargaService.update(+id, updateProdukHargaDto);
  }

  @Delete(':id')
  @RequirePermission('produk-harga:write')
  remove(@Param('id') id: string) {
    return this.produkHargaService.remove(+id);
  }
}
