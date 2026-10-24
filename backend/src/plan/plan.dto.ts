
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const PLAN_STATUS = {
  DRAFT: 'DRAFT',
  DISETUJUI: 'DISETUJUI',
  BATAL: 'BATAL',
  REVISI: 'REVISI',
  LOADING: 'LOADING',
  KOMPLIT: 'KOMPLIT',
} as const;

const createPlanSchema = z.object({
  id_karyawan: z.number().int().positive(),
  id_kendaraan: z.number().int().positive(),
  id_wilayah: z.number().int().positive(),
  tanggal: z.iso.date(), 
  status: z.string().min(1).optional(),
  detailRencana: z.array(
    z.object({
      id_outlet: z.number().int().positive(),
      urutan: z.number().int().positive(),
    }).strict(),
  ).default([]),
}).strict();

export class CreatePlanDto extends createZodDto(createPlanSchema) { }

export class UpdatePlanDto extends createZodDto(
  createPlanSchema.partial(),
) { }

export class UpdateStatusPlanDto extends createZodDto(
  z.object({
    status: z.enum(Object.values(PLAN_STATUS) as [string, ...string[]]),
  }).strict(),
) { }

export class FindAllPlanDto extends createZodDto(
  z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    status: z.string().optional(),
    tanggalStart: z.string().optional(),
    tanggalEnd: z.string().optional(),
    id_wilayah: z.coerce.number().int().positive().optional(),
  }),
) { }
