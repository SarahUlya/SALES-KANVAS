
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const detailProdukInSchema = z.object({
  id_produk: z.number().int().positive(),
  id_batch: z.number().int().positive(),
  qty: z.number().int().positive(),
}).strict();

const createProdukInSchema = z.object({
  id_gudang: z.number().int().positive(),
  tanggal: z.string().min(1),
  jenis_transaksi: z.string().min(1),
  keterangan: z.string().max(255).nullable().optional(),
  detailProdukIn: z.array(detailProdukInSchema).min(1),
}).strict();

export class CreateProdukInDto extends createZodDto(
  createProdukInSchema,
) {}

export class UpdateProdukInDto extends createZodDto(
  createProdukInSchema.partial(),
) {}
