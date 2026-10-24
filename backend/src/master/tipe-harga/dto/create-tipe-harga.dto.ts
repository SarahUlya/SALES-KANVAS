
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const tipeHargaSchema = z.object({
  nama_tipe: z.string().min(1),
}).strict();

export class CreateTipeHargaDto extends createZodDto(tipeHargaSchema) {}

export class UpdateTipeHargaDto extends createZodDto(
  tipeHargaSchema.partial(),
) {}
