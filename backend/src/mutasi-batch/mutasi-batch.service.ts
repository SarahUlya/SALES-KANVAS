
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMutasiBatchDto,

} from './dto/create-mutasi-batch.dto';
import { UpdateMutasiBatchDto } from './dto/update-mutasi-batch.dto';

@Injectable()
export class MutasiBatchService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMutasiBatchDto) {
    return this.prisma.mutasiBatch.create({
      data: {
        id_produk: dto.id_produk,
        id_gudang: dto.id_gudang,
        id_batch: dto.id_batch,
        tanggal: new Date(dto.tanggal),
        stok_masuk: dto.stok_masuk,
        stok_keluar: dto.stok_keluar,
        keterangan: dto.keterangan,
      },
      include: {
        produk: true,
        gudang: true,
        batch: true,
      },
    });
  }

  findAll() {
    return this.prisma.mutasiBatch.findMany({
      orderBy: { id_mutasi: 'desc' },
      include: {
        produk: true,
        gudang: true,
        batch: true,
      },
    });
  }

  async findOne(id: number) {
    const data = await this.prisma.mutasiBatch.findUnique({
      where: { id_mutasi: id },
      include: {
        produk: true,
        gudang: true,
        batch: true,
      },
    });

    if (!data) {
      throw new NotFoundException('Mutasi Batch tidak ditemukan');
    }

    return data;
  }

  async update(id: number, dto: UpdateMutasiBatchDto) {
    await this.findOne(id);

    return this.prisma.mutasiBatch.update({
      where: { id_mutasi: id },
      data: {
        ...(dto.id_produk !== undefined && {
          id_produk: dto.id_produk,
        }),
        ...(dto.id_gudang !== undefined && {
          id_gudang: dto.id_gudang,
        }),
        ...(dto.id_batch !== undefined && {
          id_batch: dto.id_batch,
        }),
        ...(dto.tanggal !== undefined && {
          tanggal: new Date(dto.tanggal),
        }),
        ...(dto.stok_masuk !== undefined && {
          stok_masuk: dto.stok_masuk,
        }),
        ...(dto.stok_keluar !== undefined && {
          stok_keluar: dto.stok_keluar,
        }),
        ...(dto.keterangan !== undefined && {
          keterangan: dto.keterangan,
        }),
      },
      include: {
        produk: true,
        gudang: true,
        batch: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.mutasiBatch.delete({
      where: { id_mutasi: id },
    });
  }
}
