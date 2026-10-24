import { PartialType } from '@nestjs/mapped-types';
import { CreateKasbonProdukDto } from './create-kasbon_produk.dto';

export class UpdateKasbonProdukDto extends PartialType(CreateKasbonProdukDto) {}
