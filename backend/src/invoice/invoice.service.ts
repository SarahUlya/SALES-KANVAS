
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from './dto/create-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInvoiceDto) {
    const total = dto.detailInvoice.reduce(
      (sum, detail) => sum + detail.qty * detail.harga,
      0,
    );

    return this.prisma.invoiceOutlet.create({
      data: {
        id_outlet: dto.id_outlet,
        id_rencana: dto.id_rencana,
        tanggal: new Date(dto.tanggal),
        status: dto.status,
        total,
        detailInvoice: {
          create: dto.detailInvoice.map((detail) => ({
            id_produk: detail.id_produk,
            id_batch: detail.id_batch,
            qty: detail.qty,
            harga: detail.harga,
            subtotal: detail.qty * detail.harga,
          })),
        },
      },
      include: {
        outlet: true,
        rencanaKanvas: true,
        detailInvoice: {
          include: {
            produk: true,
            batch: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.invoiceOutlet.findMany({
      orderBy: { id_invoice: 'desc' },
      include: {
        outlet: true,
        rencanaKanvas: true,
        detailInvoice: {
          include: {
            produk: true,
            batch: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const invoice = await this.prisma.invoiceOutlet.findUnique({
      where: { id_invoice: id },
      include: {
        outlet: true,
        rencanaKanvas: true,
        detailInvoice: {
          include: {
            produk: true,
            batch: true,
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice tidak ditemukan');
    }

    return invoice;
  }

  async update(id: number, dto: UpdateInvoiceDto) {
    await this.findOne(id);

    const data: any = {
      ...(dto.id_outlet !== undefined && {
        id_outlet: dto.id_outlet,
      }),
      ...(dto.id_rencana !== undefined && {
        id_rencana: dto.id_rencana,
      }),
      ...(dto.tanggal !== undefined && {
        tanggal: new Date(dto.tanggal),
      }),
      ...(dto.status !== undefined && {
        status: dto.status,
      }),
    };

    if (dto.detailInvoice !== undefined) {
      data.detailInvoice = {
        deleteMany: {},
        create: dto.detailInvoice.map((detail) => ({
          id_produk: detail.id_produk,
          id_batch: detail.id_batch,
          qty: detail.qty,
          harga: detail.harga,
          subtotal: detail.qty * detail.harga,
        })),
      };

      data.total = dto.detailInvoice.reduce(
        (sum, detail) => sum + detail.qty * detail.harga,
        0,
      );
    }

    return this.prisma.invoiceOutlet.update({
      where: { id_invoice: id },
      data,
      include: {
        outlet: true,
        rencanaKanvas: true,
        detailInvoice: {
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

    return this.prisma.invoiceOutlet.delete({
      where: { id_invoice: id },
    });
  }
}
