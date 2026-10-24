
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProdukOutDto,
  UpdateProdukOutDto,
} from './dto/create-produk-out.dto';

@Injectable()
export class ProdukOutService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateProdukOutDto, _userId: number, _ip: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Validasi batch, produk, dan stok gudang sebelum membuat transaksi
      for (const item of dto.detailProdukOut) {
        const batch = await tx.batchProduk.findUnique({
          where: { id_batch: item.id_batch },
        });

        if (!batch) {
          throw new BadRequestException(
            `Batch dengan ID ${item.id_batch} tidak ditemukan`,
          );
        }

        if (batch.id_produk !== item.id_produk) {
          throw new BadRequestException(
            `Batch ${item.id_batch} bukan milik produk ${item.id_produk}`,
          );
        }

        if (!Number.isInteger(item.qty) || item.qty <= 0) {
          throw new BadRequestException(
            'Qty harus berupa bilangan bulat positif',
          );
        }

        const stokGudang = await tx.stokGudang.findFirst({
          where: {
            id_batch: item.id_batch,
            id_gudang: dto.id_gudang,
          },
        });

        if (!stokGudang || stokGudang.stok < item.qty) {
          throw new BadRequestException(
            `Stok gudang tidak cukup untuk batch ${item.id_batch}`,
          );
        }
      }

      // 2. Simpan header dan detail Produk Out
      const produkOut = await tx.produkOut.create({
        data: {
          id_rencana: dto.id_rencana,
          id_gudang: dto.id_gudang,
          tanggal: new Date(dto.tanggal),
          status: dto.status ?? 'DRAFT',
          detailProdukOut: {
            create: dto.detailProdukOut.map((item) => ({
              id_produk: item.id_produk,
              id_batch: item.id_batch,
              qty: item.qty,
            })),
          },
        },
        include: {
          rencanaKanvas: true,
          gudang: true,
          detailProdukOut: {
            include: {
              produk: true,
              batch: true,
            },
          },
        },
      });

      // 3. Kurangi stok gudang dan catat mutasi setiap detail
      for (const item of dto.detailProdukOut) {
        // Kondisi stok >= qty mencegah stok menjadi negatif
        const result = await tx.stokGudang.updateMany({
          where: {
            id_batch: item.id_batch,
            id_gudang: dto.id_gudang,
            stok: { gte: item.qty },
          },
          data: {
            stok: { decrement: item.qty },
          },
        });

        if (result.count !== 1) {
          throw new BadRequestException(
            `Stok gudang batch ${item.id_batch} tidak cukup atau berubah. Silakan coba lagi.`,
          );
        }

        await tx.mutasiBatch.create({
          data: {
            id_produk: item.id_produk,
            id_gudang: dto.id_gudang,
            id_batch: item.id_batch,
            tanggal: new Date(dto.tanggal),
            stok_masuk: 0,
            stok_keluar: item.qty,
            keterangan: 'Pengeluaran produk untuk kanvas',
          },
        });
      }

      return produkOut;
    });
  }

  async findAll() {
    return this.prisma.produkOut.findMany({
      orderBy: { id_produk_out: 'desc' },
      include: {
        rencanaKanvas: true,
        gudang: true,
        detailProdukOut: {
          include: {
            produk: true,
            batch: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const data = await this.prisma.produkOut.findUnique({
      where: { id_produk_out: id },
      include: {
        rencanaKanvas: true,
        gudang: true,
        detailProdukOut: {
          include: {
            produk: true,
            batch: true,
          },
        },
      },
    });

    if (!data) {
      throw new NotFoundException('Produk Out tidak ditemukan');
    }

    return data;
  }

  async update(
    id: number,
    dto: UpdateProdukOutDto,
    _userId: number,
    _ip: string,
  ) {
    await this.findOne(id);

    return this.prisma.produkOut.update({
      where: { id_produk_out: id },
      data: {
        ...(dto.id_rencana !== undefined && {
          id_rencana: dto.id_rencana,
        }),
        ...(dto.id_gudang !== undefined && {
          id_gudang: dto.id_gudang,
        }),
        ...(dto.tanggal !== undefined && {
          tanggal: new Date(dto.tanggal),
        }),
        ...(dto.status !== undefined && {
          status: dto.status,
        }),
        ...(dto.detailProdukOut !== undefined && {
          detailProdukOut: {
            deleteMany: {},
            create: dto.detailProdukOut.map((item) => ({
              id_produk: item.id_produk,
              id_batch: item.id_batch,
              qty: item.qty,
            })),
          },
        }),
      },
      include: {
        rencanaKanvas: true,
        gudang: true,
        detailProdukOut: {
          include: {
            produk: true,
            batch: true,
          },
        },
      },
    });
  }
}
