
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBatchProdukDto,
  UpdateBatchProdukDto,
} from './dto/create-batch-produk.dto';

@Injectable()
export class BatchProdukService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBatchProdukDto) {
    return this.prisma.batchProduk.create({
      data: {
        id_produk: dto.id_produk,
        kode_batch: dto.kode_batch,
        expired_date: dto.expired_date
          ? new Date(dto.expired_date)
          : null,
        stok: dto.stok,
      },
      include: {
        produk: true,
      },
    });
  }

  async findAll() {
    return this.prisma.batchProduk.findMany({
      orderBy: { id_batch: 'desc' },
      include: {
        produk: true,
      },
    });
  }

  async findOne(id: number) {
    const batch = await this.prisma.batchProduk.findUnique({
      where: { id_batch: id },
      include: { produk: true },
    });

    if (!batch) {
      throw new NotFoundException('Batch Produk tidak ditemukan');
    }

    return batch;
  }

  async update(id: number, dto: UpdateBatchProdukDto) {
    await this.findOne(id);

    return this.prisma.batchProduk.update({
      where: { id_batch: id },
      data: {
        ...(dto.id_produk !== undefined && {
          id_produk: dto.id_produk,
        }),
        ...(dto.kode_batch !== undefined && {
          kode_batch: dto.kode_batch,
        }),
        ...(dto.expired_date !== undefined && {
          expired_date: dto.expired_date
            ? new Date(dto.expired_date)
            : null,
        }),
        ...(dto.stok !== undefined && {
          stok: dto.stok,
        }),
      },
      include: {
        produk: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.batchProduk.delete({
      where: { id_batch: id },
    });
  }
}
