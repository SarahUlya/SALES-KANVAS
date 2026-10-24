
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdukHargaDto } from './dto/create-produk-harga.dto';
import { UpdateProdukHargaDto } from './dto/update-produk-harga.dto';

@Injectable()
export class ProdukHargaService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProdukHargaDto: CreateProdukHargaDto) {
    return this.prisma.produkHarga.create({
      data: createProdukHargaDto,
      include: {
        produk: true,
        tipeHarga: true,
      },
    });
  }

  findAll() {
    return this.prisma.produkHarga.findMany({
      include: {
        produk: true,
        tipeHarga: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.produkHarga.findUnique({
      where: { id_produk_harga: id },
      include: {
        produk: true,
        tipeHarga: true,
      },
    });
  }

  update(id: number, updateProdukHargaDto: UpdateProdukHargaDto) {
    return this.prisma.produkHarga.update({
      where: { id_produk_harga: id },
      data: updateProdukHargaDto,
      include: {
        produk: true,
        tipeHarga: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.produkHarga.delete({
      where: { id_produk_harga: id },
    });
  }
}
