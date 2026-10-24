
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const productSchema = z.object({
  nama_produk: z.string().min(1),
  barcode: z.string().optional().nullable(),
  satuan: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
}).strict();

export class CreateProductDto extends createZodDto(productSchema) {}

export class UpdateProductDto extends createZodDto(
  productSchema.partial(),
) {}
