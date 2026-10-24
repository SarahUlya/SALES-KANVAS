
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateKasbonSchema = z.object({
  id_karyawan: z.number().int().positive(),
  tanggal: z.iso.date(),
  jumlah: z.number().nonnegative(),
  keterangan: z.string().max(255).optional(),
  status: z.string().max(20),
});

export class CreateKasbonDto extends createZodDto(
  CreateKasbonSchema,
) {}
