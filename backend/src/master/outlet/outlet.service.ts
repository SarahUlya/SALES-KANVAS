
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateOutletDto,
  UpdateOutletDto,
} from './dto/create-outlet.dto';

@Injectable()
export class OutletService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.outlet.findMany({
      orderBy: { nama_outlet: 'asc' },
      include: { wilayahKanvas: true },
    });
  }

  findOne(id: number) {
    return this.prisma.outlet.findUniqueOrThrow({
      where: { id_outlet: id },
      include: { wilayahKanvas: true },
    });
  }

  create(
    dto: CreateOutletDto,
    _userId: number,
    _ip: string,
  ) {
    return this.prisma.outlet.create({
      data: {
        id_wilayah: dto.id_wilayah,
        nama_outlet: dto.nama_outlet,
        alamat: dto.alamat,
        no_hp: dto.no_hp,
      },
    });
  }

  update(
    id: number,
    dto: UpdateOutletDto,
    _userId: number,
    _ip: string,
  ) {
    return this.prisma.outlet.update({
      where: { id_outlet: id },
      data: {
        ...(dto.id_wilayah !== undefined && {
          id_wilayah: dto.id_wilayah,
        }),
        ...(dto.nama_outlet !== undefined && {
          nama_outlet: dto.nama_outlet,
        }),
        ...(dto.alamat !== undefined && {
          alamat: dto.alamat,
        }),
        ...(dto.no_hp !== undefined && {
          no_hp: dto.no_hp,
        }),
      },
    });
  }

  remove(id: number) {
    return this.prisma.outlet.delete({
      where: { id_outlet: id },
    });
  }
}
