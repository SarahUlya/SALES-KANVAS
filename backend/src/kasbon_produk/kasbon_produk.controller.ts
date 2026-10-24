import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Authenticated } from '../common/decorators/authenticated.decorator';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { KasbonProdukService } from './kasbon_produk.service';
import { CreateKasbonProdukDto } from './dto/create-kasbon_produk.dto';
import { UpdateKasbonProdukDto } from './dto/update-kasbon_produk.dto';

@Controller('kasbon-produk')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class KasbonProdukController {
  constructor(private readonly kasbonProdukService: KasbonProdukService) {}

  @Post()
  @Authenticated()
  create(@Body() createKasbonProdukDto: CreateKasbonProdukDto) {
    return this.kasbonProdukService.create(createKasbonProdukDto);
  }

  @Get()
  @Authenticated()
  findAll() {
    return this.kasbonProdukService.findAll();
  }

  @Get(':id')
  @Authenticated()
  findOne(@Param('id') id: string) {
    return this.kasbonProdukService.findOne(+id);
  }

  @Patch(':id')
  @Authenticated()
  update(@Param('id') id: string, @Body() updateKasbonProdukDto: UpdateKasbonProdukDto) {
    return this.kasbonProdukService.update(+id, updateKasbonProdukDto);
  }

  @Delete(':id')
  @Authenticated()
  remove(@Param('id') id: string) {
    return this.kasbonProdukService.remove(+id);
  }
}
