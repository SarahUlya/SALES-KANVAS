import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Authenticated } from '../common/decorators/authenticated.decorator';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { KasbonService } from './kasbon.service';
import { CreateKasbonDto } from './dto/create-kasbon.dto';
import { UpdateKasbonDto } from './dto/update-kasbon.dto';

@Controller('kasbon')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class KasbonController {
  constructor(private readonly kasbonService: KasbonService) {}

  @Post()
  @Authenticated()
  create(@Body() createKasbonDto: CreateKasbonDto) {
    return this.kasbonService.create(createKasbonDto);
  }

  @Get()
  @Authenticated()
  findAll() {
    return this.kasbonService.findAll();
  }

  @Get(':id')
  @Authenticated()
  findOne(@Param('id') id: string) {
    return this.kasbonService.findOne(+id);
  }

  @Patch(':id')
  @Authenticated()
  update(@Param('id') id: string, @Body() updateKasbonDto: UpdateKasbonDto) {
    return this.kasbonService.update(+id, updateKasbonDto);
  }

  @Delete(':id')
  @Authenticated()
  remove(@Param('id') id: string) {
    return this.kasbonService.remove(+id);
  }
}
