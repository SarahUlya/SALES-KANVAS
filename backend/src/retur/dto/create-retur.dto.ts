import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const detailReturSchema = z.object({
  id_produk: z.number().int().positive(),
  id_batch: z.number().int().positive(),
  qty: z.number().int().positive(),
  harga: z.number().nonnegative(),
}).strict();

const createReturSchema = z.object({
  id_invoice: z.number().int().positive(),
  tanggal: z.string().min(1),
  alasan: z.string().max(255).nullable().optional(),
  status: z.string().min(1),
  detailRetur: z.array(detailReturSchema).min(1),
}).strict();

export class CreateReturDto extends createZodDto(createReturSchema) {}

export class UpdateReturDto extends createZodDto(
  createReturSchema.partial(),
) {}