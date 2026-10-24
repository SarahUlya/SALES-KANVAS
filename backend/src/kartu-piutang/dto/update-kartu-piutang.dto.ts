import { PartialType } from '@nestjs/mapped-types';

import { CreateKartuPiutangOutletDto } from './create-kartu-piutang.dto';

export class UpdateKartuPiutangDto extends PartialType(CreateKartuPiutangOutletDto) {}
