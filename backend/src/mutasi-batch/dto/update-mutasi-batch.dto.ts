import { PartialType } from '@nestjs/mapped-types';
import { CreateMutasiBatchDto } from './create-mutasi-batch.dto';

export class UpdateMutasiBatchDto extends PartialType(CreateMutasiBatchDto) {}
