
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMarketAreaDto, UpdateMarketAreaDto } from './market-area.dto';

@Injectable()
export class MarketAreaService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.wilayahKanvas.findMany({
      orderBy: { nama_wilayah: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.wilayahKanvas.findUniqueOrThrow({
      where: { id_wilayah: id },
    });
  }

  create(dto: CreateMarketAreaDto, _userId: number, _ip: string) {
    return this.prisma.wilayahKanvas.create({
      data: {
        nama_wilayah: dto.nama_wilayah,
      },
    });
  }

  update(id: number, dto: UpdateMarketAreaDto, _userId: number, _ip: string) {
    return this.prisma.wilayahKanvas.update({
      where: { id_wilayah: id },
      data: {
        ...(dto.nama_wilayah !== undefined && {
          nama_wilayah: dto.nama_wilayah,
        }),
      },
    });
  }

  remove(id: number) {
    return this.prisma.wilayahKanvas.delete({
      where: { id_wilayah: id },
    });
  }
}
