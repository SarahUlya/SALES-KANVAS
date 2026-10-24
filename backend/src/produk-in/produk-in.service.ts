
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProdukInDto,
  UpdateProdukInDto,
} from './dto/create-produk-in.dto';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class ProdukInService {
  constructor(private readonly prisma: PrismaService) { }


  async create(dto: CreateProdukInDto) {
    return this.prisma.$transaction(async (tx) => {
        // 1. Validasi batch dan stok sebelum membuat transaksi
        for (const detail of dto.detailProdukIn) {
          const batch = await tx.batchProduk.findUnique({
            where: { id_batch: detail.id_batch },
          });

          if (!batch) {
            throw new NotFoundException(
              `Batch ${detail.id_batch} tidak ditemukan`,
            );
          }

          if (batch.id_produk !== detail.id_produk) {
            throw new NotFoundException(
              `Produk tidak sesuai dengan batch ${detail.id_batch}`,
            );
          }

          if (batch.stok < detail.qty) {
            throw new NotFoundException(
              `Stok batch ${batch.kode_batch ?? batch.id_batch} tidak cukup. ` +
              `Tersedia ${batch.stok}, diminta ${detail.qty}`,
            );
          }
        }

        // 2. Buat transaksi Produk Masuk beserta detailnya
        const produkIn = await tx.produkIn.create({
          data: {
            id_gudang: dto.id_gudang,
            tanggal: new Date(dto.tanggal),
            jenis_transaksi: dto.jenis_transaksi,
            keterangan: dto.keterangan,
            detailProdukIn: {
              create: dto.detailProdukIn.map((detail) => ({
                id_produk: detail.id_produk,
                id_batch: detail.id_batch,
                qty: detail.qty,
              })),
            },
          },
          include: {
            gudang: true,
            detailProdukIn: {
              include: { produk: true, batch: true },
            },
          },
        });

        // 3. Kurangi stok yang masih tersedia pada batch
        //    Tambah stok di gudang tujuan
        //    Catat mutasi stok masuk
        for (const detail of dto.detailProdukIn) {
          await tx.batchProduk.update({
            where: { id_batch: detail.id_batch },
            data: { stok: { decrement: detail.qty } },
          });

          await tx.stokGudang.upsert({
            where: {
              id_batch_id_gudang: {
                id_batch: detail.id_batch,
                id_gudang: dto.id_gudang,
              },
            },
            create: {
              id_batch: detail.id_batch,
              id_gudang: dto.id_gudang,
              stok: detail.qty,
            },
            update: {
              stok: { increment: detail.qty },
            },
          });

          await tx.mutasiBatch.create({
            data: {
              id_produk: detail.id_produk,
              id_gudang: dto.id_gudang,
              id_batch: detail.id_batch,
              tanggal: new Date(dto.tanggal),
              stok_masuk: detail.qty,
              stok_keluar: 0,
              keterangan:
                dto.keterangan ?? `Produk masuk #${produkIn.id_produk_in}`,
            },
          });
        }

        return produkIn;
      });
  }


  findAll() {
    return this.prisma.produkIn.findMany({
      orderBy: { id_produk_in: 'desc' },
      include: {
        gudang: true,
        detailProdukIn: {
          include: {
            produk: true,
            batch: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const data = await this.prisma.produkIn.findUnique({
      where: { id_produk_in: id },
      include: {
        gudang: true,
        detailProdukIn: {
          include: {
            produk: true,
            batch: true,
          },
        },
      },
    });

    if (!data) {
      throw new NotFoundException('Produk In tidak ditemukan');
    }

    return data;
  }

  async update(id: number, dto: UpdateProdukInDto) {
    await this.findOne(id);

    return this.prisma.produkIn.update({
      where: { id_produk_in: id },
      data: {
        ...(dto.id_gudang !== undefined && {
          id_gudang: dto.id_gudang,
        }),
        ...(dto.tanggal !== undefined && {
          tanggal: new Date(dto.tanggal),
        }),
        ...(dto.jenis_transaksi !== undefined && {
          jenis_transaksi: dto.jenis_transaksi,
        }),
        ...(dto.keterangan !== undefined && {
          keterangan: dto.keterangan,
        }),
        ...(dto.detailProdukIn !== undefined && {
          detailProdukIn: {
            deleteMany: {},
            create: dto.detailProdukIn.map((detail) => ({
              id_produk: detail.id_produk,
              id_batch: detail.id_batch,
              qty: detail.qty,
            })),
          },
        }),
      },
      include: {
        gudang: true,
        detailProdukIn: {
          include: {
            produk: true,
            batch: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.produkIn.delete({
      where: { id_produk_in: id },
    });
  }
}
