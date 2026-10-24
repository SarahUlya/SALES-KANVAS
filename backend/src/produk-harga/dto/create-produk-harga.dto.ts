
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateProdukHargaSchema = z.object({
  id_produk: z.number().int().positive(),
  id_tipe_harga: z.number().int().positive(),
  harga: z.number().nonnegative(),
});

export class CreateProdukHargaDto extends createZodDto(
  CreateProdukHargaSchema,
) {}
