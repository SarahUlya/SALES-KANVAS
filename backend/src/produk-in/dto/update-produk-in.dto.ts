import { PartialType } from '@nestjs/mapped-types';
import { CreateProdukInDto } from './create-produk-in.dto';

export class UpdateProdukInDto extends PartialType(CreateProdukInDto) {}
