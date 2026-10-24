import { PartialType } from '@nestjs/mapped-types';
import { CreatePembayaranInvoiceDto } from './create-pembayaran-invoice.dto';

export class UpdatePembayaranInvoiceDto extends PartialType(CreatePembayaranInvoiceDto) {}
