
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const detailInvoiceSchema = z.object({
  id_produk: z.number().int().positive(),
  id_batch: z.number().int().positive(),
  qty: z.number().int().positive(),
  harga: z.number().nonnegative(),
}).strict();

const createInvoiceSchema = z.object({
  id_outlet: z.number().int().positive(),
  id_rencana: z.number().int().positive(),
  tanggal: z.string().min(1),
  status: z.string().min(1),
  detailInvoice: z.array(detailInvoiceSchema).min(1),
}).strict();

export class CreateInvoiceDto extends createZodDto(
  createInvoiceSchema,
) {}

export class UpdateInvoiceDto extends createZodDto(
  createInvoiceSchema.partial(),
) {}
