
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
import { InvoiceService } from './invoice.service';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from './dto/create-invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('invoice')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
  ) {}

  @Post()
  @RequirePermission('invoice:write')
  @ResponseMessage('Invoice created successfully')
  create(@Body() dto: CreateInvoiceDto) {
    return this.invoiceService.create(dto);
  }

  @Get()
  @RequirePermission('invoice:read')
  @ResponseMessage('List Invoice')
  findAll() {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  @RequirePermission('invoice:read')
  @ResponseMessage('Detail Invoice')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission('invoice:write')
  @ResponseMessage('Invoice updated successfully')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInvoiceDto,
  ) {
    return this.invoiceService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('invoice:write')
  @ResponseMessage('Invoice deleted successfully')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.remove(id);
  }
}
