
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const createMutasiBatchSchema = z.object({
  id_produk: z.number().int().positive(),
  id_gudang: z.number().int().positive(),
  id_batch: z.number().int().positive(),
  tanggal: z.string().min(1),
  stok_masuk: z.number().int().min(0),
  stok_keluar: z.number().int().min(0),
  keterangan: z.string().nullable().optional(),
}).strict();

export class CreateMutasiBatchDto extends createZodDto(
  createMutasiBatchSchema,
) {}
