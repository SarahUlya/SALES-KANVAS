
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { BatchProdukService } from './batch-produk.service';
import {
  CreateBatchProdukDto,
  UpdateBatchProdukDto,
} from './dto/create-batch-produk.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('batch-produk')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BatchProdukController {
  constructor(
    private readonly batchProdukService: BatchProdukService,
  ) {}

  @Post()
  @RequirePermission('batch-produk:write')
  @ResponseMessage('Batch Produk created successfully')
  create(@Body() dto: CreateBatchProdukDto) {
    return this.batchProdukService.create(dto);
  }

  @Get()
  @RequirePermission('batch-produk:read')
  @ResponseMessage('List Batch Produk')
  findAll() {
    return this.batchProdukService.findAll();
  }

  @Get(':id')
  @RequirePermission('batch-produk:read')
  @ResponseMessage('Detail Batch Produk')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.batchProdukService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission('batch-produk:write')
  @ResponseMessage('Batch Produk updated successfully')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBatchProdukDto,
  ) {
    return this.batchProdukService.update(id, dto);
  }

  // @Delete(':id')
  // @RequirePermission('batch-produk:write')
  // @ResponseMessage('Batch Produk deleted successfully')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.batchProdukService.remove(id);
  // }
}
