import { PartialType } from '@nestjs/mapped-types';
import { CreateProdukOutDto } from './create-produk-out.dto';

export class UpdateProdukOutDto extends PartialType(CreateProdukOutDto) {}
