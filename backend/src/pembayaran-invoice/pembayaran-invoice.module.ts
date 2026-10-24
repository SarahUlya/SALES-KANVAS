import { Module } from '@nestjs/common';
import { PembayaranInvoiceService } from './pembayaran-invoice.service';
import { PembayaranInvoiceController } from './pembayaran-invoice.controller';

@Module({
  controllers: [PembayaranInvoiceController],
  providers: [PembayaranInvoiceService],
})
export class PembayaranInvoiceModule {}
