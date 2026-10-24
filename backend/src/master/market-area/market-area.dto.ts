
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const marketAreaSchema = z.object({
  nama_wilayah: z.string().min(1),
}).strict();

export class CreateMarketAreaDto extends createZodDto(marketAreaSchema) {}

export class UpdateMarketAreaDto extends createZodDto(
  marketAreaSchema.partial(),
) {}
