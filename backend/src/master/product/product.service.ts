
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.produk.findMany({
      orderBy: { id_produk: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.produk.findUniqueOrThrow({
      where: { id_produk: id },
    });
  }

  create(dto: CreateProductDto, _userId: number, _ip: string) {
    return this.prisma.produk.create({
      data: {
        nama_produk: dto.nama_produk,
        barcode: dto.barcode,
        satuan: dto.satuan,
        status: dto.status,
      },
    });
  }

  update(id: number, dto: UpdateProductDto, _userId: number, _ip: string) {
    return this.prisma.produk.update({
      where: { id_produk: id },
      data: {
        ...(dto.nama_produk !== undefined && {
          nama_produk: dto.nama_produk,
        }),
        ...(dto.barcode !== undefined && { barcode: dto.barcode }),
        ...(dto.satuan !== undefined && { satuan: dto.satuan }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });
  }

  remove(id: number) {
    return this.prisma.produk.delete({
      where: { id_produk: id },
    });
  }
}
