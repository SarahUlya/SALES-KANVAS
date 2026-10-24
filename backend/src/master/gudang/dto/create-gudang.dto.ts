
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const gudangSchema = z.object({
  nama_gudang: z.string().min(1),
  lokasi: z.string().optional().nullable(),
}).strict();

export class CreateGudangDto extends createZodDto(gudangSchema) {}

export class UpdateGudangDto extends createZodDto(
  gudangSchema.partial(),
) {}
