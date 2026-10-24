
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

import { PembayaranInvoiceService } from './pembayaran-invoice.service';
import {
  CreatePembayaranInvoiceDto,
  UpdatePembayaranInvoiceDto,
} from './dto/create-pembayaran-invoice.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('pembayaran-invoice')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PembayaranInvoiceController {
  constructor(
    private readonly pembayaranInvoiceService: PembayaranInvoiceService,
  ) {}

  @Post()
  @RequirePermission('pembayaran-invoice:write')
  @ResponseMessage('Pembayaran invoice created successfully')
  create(@Body() dto: CreatePembayaranInvoiceDto) {
    return this.pembayaranInvoiceService.create(dto);
  }

  @Get()
  @RequirePermission('pembayaran-invoice:read')
  @ResponseMessage('List Pembayaran Invoice')
  findAll() {
    return this.pembayaranInvoiceService.findAll();
  }

  @Get(':id')
  @RequirePermission('pembayaran-invoice:read')
  @ResponseMessage('Detail Pembayaran Invoice')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pembayaranInvoiceService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission('pembayaran-invoice:write')
  @ResponseMessage('Pembayaran invoice updated successfully')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePembayaranInvoiceDto,
  ) {
    return this.pembayaranInvoiceService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('pembayaran-invoice:write')
  @ResponseMessage('Pembayaran invoice deleted successfully')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pembayaranInvoiceService.remove(id);
  }
}
