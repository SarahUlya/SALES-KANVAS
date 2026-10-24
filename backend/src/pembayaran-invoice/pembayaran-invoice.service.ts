
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePembayaranInvoiceDto,
  UpdatePembayaranInvoiceDto,
} from './dto/create-pembayaran-invoice.dto';

@Injectable()
export class PembayaranInvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePembayaranInvoiceDto) {
    const invoice = await this.prisma.invoiceOutlet.findUnique({
      where: { id_invoice: dto.id_invoice },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice tidak ditemukan');
    }

    return this.prisma.pembayaranInvoice.create({
      data: {
        id_invoice: dto.id_invoice,
        tanggal: new Date(dto.tanggal),
        jumlah: dto.jumlah,
        metode: dto.metode,
      },
      include: {
        invoice: true,
      },
    });
  }

  async findAll() {
    return this.prisma.pembayaranInvoice.findMany({
      include: {
        invoice: true,
      },
      orderBy: {
        id_pembayaran: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const pembayaran = await this.prisma.pembayaranInvoice.findUnique({
      where: { id_pembayaran: id },
      include: {
        invoice: true,
      },
    });

    if (!pembayaran) {
      throw new NotFoundException('Pembayaran invoice tidak ditemukan');
    }

    return pembayaran;
  }

  async update(
    id: number,
    dto: UpdatePembayaranInvoiceDto,
  ) {
    await this.findOne(id);

    if (dto.id_invoice !== undefined) {
      const invoice = await this.prisma.invoiceOutlet.findUnique({
        where: { id_invoice: dto.id_invoice },
      });

      if (!invoice) {
        throw new NotFoundException('Invoice tidak ditemukan');
      }
    }

    return this.prisma.pembayaranInvoice.update({
      where: { id_pembayaran: id },
      data: {
        ...(dto.id_invoice !== undefined && {
          id_invoice: dto.id_invoice,
        }),
        ...(dto.tanggal !== undefined && {
          tanggal: new Date(dto.tanggal),
        }),
        ...(dto.jumlah !== undefined && {
          jumlah: dto.jumlah,
        }),
        ...(dto.metode !== undefined && {
          metode: dto.metode,
        }),
      },
      include: {
        invoice: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.pembayaranInvoice.delete({
      where: { id_pembayaran: id },
    });
  }
}
