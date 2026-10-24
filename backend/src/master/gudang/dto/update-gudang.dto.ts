import { PartialType } from '@nestjs/mapped-types';
import { CreateGudangDto } from './create-gudang.dto';

export class UpdateGudangDto extends PartialType(CreateGudangDto) {}
