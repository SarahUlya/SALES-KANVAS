
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const detailProdukOutSchema = z.object({
  id_produk: z.number().int().positive(),
  id_batch: z.number().int().positive(),
  qty: z.number().int().positive(),
}).strict();

const createProdukOutSchema = z.object({
  id_rencana: z.number().int().positive(),
  id_gudang: z.number().int().positive(),
  tanggal: z.string().min(1),
  status: z.string().min(1).optional(),
  detailProdukOut: z.array(detailProdukOutSchema).min(1),
}).strict();

export class CreateProdukOutDto extends createZodDto(
  createProdukOutSchema,
) {}

export class UpdateProdukOutDto extends createZodDto(
  createProdukOutSchema.partial(),
) {}
