import { PartialType } from '@nestjs/mapped-types';
import { CreateTipeHargaDto } from './create-tipe-harga.dto';

export class UpdateTipeHargaDto extends PartialType(CreateTipeHargaDto) {}
