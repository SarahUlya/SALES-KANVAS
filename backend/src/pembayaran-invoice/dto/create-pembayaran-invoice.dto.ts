
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createPembayaranInvoiceSchema = z.object({
  id_invoice: z.number().int().positive(),
  tanggal: z.string().min(1),
  jumlah: z.number().positive(),
  metode: z.string().min(1).max(30),
}).strict();

export class CreatePembayaranInvoiceDto extends createZodDto(
  createPembayaranInvoiceSchema,
) {}

export class UpdatePembayaranInvoiceDto extends createZodDto(
  createPembayaranInvoiceSchema.partial(),
) {}
