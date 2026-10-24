
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateGudangDto,
  UpdateGudangDto,
} from './dto/create-gudang.dto';

@Injectable()
export class GudangService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.gudang.findMany({
      orderBy: { nama_gudang: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.gudang.findUniqueOrThrow({
      where: { id_gudang: id },
    });
  }

  create(
    dto: CreateGudangDto,
    _userId: number,
    _ip: string,
  ) {
    return this.prisma.gudang.create({
      data: {
        nama_gudang: dto.nama_gudang,
        lokasi: dto.lokasi,
      },
    });
  }

  update(
    id: number,
    dto: UpdateGudangDto,
    _userId: number,
    _ip: string,
  ) {
    return this.prisma.gudang.update({
      where: { id_gudang: id },
      data: {
        ...(dto.nama_gudang !== undefined && {
          nama_gudang: dto.nama_gudang,
        }),
        ...(dto.lokasi !== undefined && {
          lokasi: dto.lokasi,
        }),
      },
    });
  }

  remove(id: number) {
    return this.prisma.gudang.delete({
      where: { id_gudang: id },
    });
  }
}
