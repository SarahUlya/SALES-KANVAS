import { PartialType } from '@nestjs/mapped-types';
import { CreateBatchProdukDto } from './create-batch-produk.dto';

export class UpdateBatchProdukDto extends PartialType(CreateBatchProdukDto) {}
