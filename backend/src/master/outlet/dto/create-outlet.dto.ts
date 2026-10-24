
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const outletSchema = z.object({
  id_wilayah: z.number().int().positive(),
  nama_outlet: z.string().min(1),
  alamat: z.string().optional().nullable(),
  no_hp: z.string().optional().nullable(),
}).strict();

export class CreateOutletDto extends createZodDto(outletSchema) {}

export class UpdateOutletDto extends createZodDto(
  outletSchema.partial(),
) {}
