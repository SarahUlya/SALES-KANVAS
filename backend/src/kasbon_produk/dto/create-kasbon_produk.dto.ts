
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateKasbonProdukSchema = z.object({
  id_karyawan: z.number().int().positive(),
  tanggal: z.iso.date(),
  status: z.string().max(20),
  keterangan: z.string().max(255).optional(),
  detailKasbonProduk: z.array(
    z.object({
      id_produk: z.number().int().positive(),
      qty: z.number().int().positive(),
    }),
  ).min(1),
});

export class CreateKasbonProdukDto extends createZodDto(
  CreateKasbonProdukSchema,
) {}
