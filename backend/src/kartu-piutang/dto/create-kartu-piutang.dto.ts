
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createKartuPiutangOutletSchema = z.object({
  id_outlet: z.number().int().positive(),
  id_invoice: z.number().int().positive(),
  tanggal: z.string().min(1),
  debit: z.number().nonnegative(),
  kredit: z.number().nonnegative(),
  keterangan: z.string().max(255).nullable().optional(),
}).strict();

export class CreateKartuPiutangOutletDto extends createZodDto(
  createKartuPiutangOutletSchema,
) {}

export class UpdateKartuPiutangOutletDto extends createZodDto(
  createKartuPiutangOutletSchema.partial(),
) {}
