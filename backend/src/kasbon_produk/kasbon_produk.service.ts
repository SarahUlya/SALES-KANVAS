
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKasbonProdukDto } from './dto/create-kasbon_produk.dto';
import { UpdateKasbonProdukDto } from './dto/update-kasbon_produk.dto';

@Injectable()
export class KasbonProdukService {
  constructor(private readonly prisma: PrismaService) { }


  create(createKasbonProdukDto: CreateKasbonProdukDto) {
    const { detailKasbonProduk, tanggal, ...data } =
      createKasbonProdukDto;

    return this.prisma.kasbonProduk.create({
      data: {
        ...data,
        tanggal: new Date(`${tanggal}T00:00:00.000Z`),
        detailKasbonProduk: {
          create: detailKasbonProduk,
        },
      },
      include: {
        karyawan: true,
        detailKasbonProduk: {
          include: {
            produk: true,
          },
        },
      },
    });
  }


  findAll() {
    return this.prisma.kasbonProduk.findMany({
      include: {
        karyawan: true,
        detailKasbonProduk: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.kasbonProduk.findUnique({
      where: { id_kasbon_produk: id },
      include: {
        karyawan: true,
        detailKasbonProduk: true,
      },
    });
  }

  update(id: number, updateKasbonProdukDto: UpdateKasbonProdukDto) {
    const { tanggal, detailKasbonProduk, ...data } =
      updateKasbonProdukDto;

    return this.prisma.kasbonProduk.update({
      where: { id_kasbon_produk: id },
      data: {
        ...data,
        ...(tanggal !== undefined && {
          tanggal: new Date(`${tanggal}T00:00:00.000Z`),
        }),
        ...(detailKasbonProduk !== undefined && {
          detailKasbonProduk: {
            deleteMany: {},
            create: detailKasbonProduk,
          },
        }),
      },
      include: {
        karyawan: true,
        detailKasbonProduk: {
          include: {
            produk: true,
          },
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.kasbonProduk.delete({
      where: { id_kasbon_produk: id },
    });
  }
}
