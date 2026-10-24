
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const batchProdukSchema = z.object({
  id_produk: z.number().int().positive(),
  kode_batch: z.string().optional().nullable(),
  expired_date: z.string().optional().nullable(),
  stok: z.number().int().min(0),
}).strict();

export class CreateBatchProdukDto extends createZodDto(
  batchProdukSchema,
) {}

export class UpdateBatchProdukDto extends createZodDto(
  batchProdukSchema.partial(),
) {}
