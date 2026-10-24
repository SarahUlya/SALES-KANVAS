
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateTipeHargaDto,
  UpdateTipeHargaDto,
} from './dto/create-tipe-harga.dto';

@Injectable()
export class TipeHargaService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.tipeHarga.findMany({
      orderBy: { nama_tipe: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.tipeHarga.findUniqueOrThrow({
      where: { id_tipe_harga: id },
    });
  }

  create(
    dto: CreateTipeHargaDto,
    _userId: number,
    _ip: string,
  ) {
    return this.prisma.tipeHarga.create({
      data: {
        nama_tipe: dto.nama_tipe,
      },
    });
  }

  update(
    id: number,
    dto: UpdateTipeHargaDto,
    _userId: number,
    _ip: string,
  ) {
    return this.prisma.tipeHarga.update({
      where: { id_tipe_harga: id },
      data: {
        ...(dto.nama_tipe !== undefined && {
          nama_tipe: dto.nama_tipe,
        }),
      },
    });
  }

  remove(id: number) {
    return this.prisma.tipeHarga.delete({
      where: { id_tipe_harga: id },
    });
  }
}
