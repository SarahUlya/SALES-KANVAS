
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const vehicleSchema = z.object({
  nomor_plat: z.string().min(1),
  jenis: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
}).strict();

export class CreateVehicleDto extends createZodDto(vehicleSchema) {}

export class UpdateVehicleDto extends createZodDto(
  vehicleSchema.partial(),
) {}
