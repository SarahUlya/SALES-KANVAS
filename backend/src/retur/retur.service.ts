
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateReturDto,
  UpdateReturDto,
} from './dto/create-retur.dto';

@Injectable()
export class ReturService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReturDto) {
    const { detailRetur, tanggal, ...data } = dto;

    return this.prisma.invoiceReturProduk.create({
      data: {
        ...data,
        tanggal: new Date(tanggal),
        detailRetur: {
          create: detailRetur.map((item) => ({
            id_produk: item.id_produk,
            id_batch: item.id_batch,
            qty: item.qty,
            harga: item.harga,
          })),
        },
      },
      include: {
        invoice: true,
        detailRetur: {
          include: {
            produk: true,
            batch: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.invoiceReturProduk.findMany({
      include: {
        invoice: true,
        detailRetur: {
          include: {
            produk: true,
            batch: true,
          },
        },
      },
      orderBy: {
        id_retur: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const retur = await this.prisma.invoiceReturProduk.findUnique({
      where: { id_retur: id },
      include: {
        invoice: true,
        detailRetur: {
          include: {
            produk: true,
            batch: true,
          },
        },
      },
    });

    if (!retur) {
      throw new NotFoundException('Data retur tidak ditemukan');
    }

    return retur;
  }

  async update(id: number, dto: UpdateReturDto) {
    await this.findOne(id);

    const { detailRetur, tanggal, ...data } = dto;

    return this.prisma.invoiceReturProduk.update({
      where: { id_retur: id },
      data: {
        ...data,
        ...(tanggal !== undefined && {
          tanggal: new Date(tanggal),
        }),
        ...(detailRetur !== undefined && {
          detailRetur: {
            deleteMany: {},
            create: detailRetur.map((item) => ({
              id_produk: item.id_produk,
              id_batch: item.id_batch,
              qty: item.qty,
              harga: item.harga,
            })),
          },
        }),
      },
      include: {
        invoice: true,
        detailRetur: {
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

    return this.prisma.invoiceReturProduk.delete({
      where: { id_retur: id },
    });
  }
}
