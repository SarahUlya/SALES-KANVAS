
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const id = z.number().int().positive();

const employeeSchema = z
  .object({
    id_user: id,
    nama: z.string().min(1),
    no_hp: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
  })
  .strict();

export class CreateEmployeeDto extends createZodDto(employeeSchema) {}

export class UpdateEmployeeDto extends createZodDto(
  employeeSchema.partial().omit({ id_user: true }),
) {}
