import { PartialType } from '@nestjs/mapped-types';
import { CreateProdukHargaDto } from './create-produk-harga.dto';

export class UpdateProdukHargaDto extends PartialType(CreateProdukHargaDto) {}
