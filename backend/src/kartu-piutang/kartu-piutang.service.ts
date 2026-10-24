
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateKartuPiutangOutletDto,
  UpdateKartuPiutangOutletDto,
} from './dto/create-kartu-piutang.dto';

@Injectable()
export class KartuPiutangOutletService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateKartuPiutangOutletDto) {
    const invoice = await this.prisma.invoiceOutlet.findUnique({
      where: { id_invoice: dto.id_invoice },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice tidak ditemukan');
    }

    const outlet = await this.prisma.outlet.findUnique({
      where: { id_outlet: dto.id_outlet },
    });

    if (!outlet) {
      throw new NotFoundException('Outlet tidak ditemukan');
    }

    return this.prisma.kartuPiutangOutlet.create({
      data: {
        id_outlet: dto.id_outlet,
        id_invoice: dto.id_invoice,
        tanggal: new Date(dto.tanggal),
        debit: dto.debit,
        kredit: dto.kredit,
        keterangan: dto.keterangan,
      },
      include: {
        outlet: true,
        invoice: true,
      },
    });
  }

  async findAll() {
    return this.prisma.kartuPiutangOutlet.findMany({
      include: {
        outlet: true,
        invoice: true,
      },
      orderBy: {
        id_piutang: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const piutang = await this.prisma.kartuPiutangOutlet.findUnique({
      where: { id_piutang: id },
      include: {
        outlet: true,
        invoice: true,
      },
    });

    if (!piutang) {
      throw new NotFoundException(
        'Data kartu piutang outlet tidak ditemukan',
      );
    }

    return piutang;
  }

  async update(
    id: number,
    dto: UpdateKartuPiutangOutletDto,
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

    if (dto.id_outlet !== undefined) {
      const outlet = await this.prisma.outlet.findUnique({
        where: { id_outlet: dto.id_outlet },
      });

      if (!outlet) {
        throw new NotFoundException('Outlet tidak ditemukan');
      }
    }

    return this.prisma.kartuPiutangOutlet.update({
      where: { id_piutang: id },
      data: {
        ...(dto.id_outlet !== undefined && {
          id_outlet: dto.id_outlet,
        }),
        ...(dto.id_invoice !== undefined && {
          id_invoice: dto.id_invoice,
        }),
        ...(dto.tanggal !== undefined && {
          tanggal: new Date(dto.tanggal),
        }),
        ...(dto.debit !== undefined && {
          debit: dto.debit,
        }),
        ...(dto.kredit !== undefined && {
          kredit: dto.kredit,
        }),
        ...(dto.keterangan !== undefined && {
          keterangan: dto.keterangan,
        }),
      },
      include: {
        outlet: true,
        invoice: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.kartuPiutangOutlet.delete({
      where: { id_piutang: id },
    });
  }
}
