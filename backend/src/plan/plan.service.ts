
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePlanDto,
  FindAllPlanDto,
  PLAN_STATUS,
  UpdatePlanDto,
  UpdateStatusPlanDto,
} from './plan.dto';

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePlanDto, _userId: number, _ip: string) {
    return this.prisma.$transaction(async (tx) => {
      const { detailRencana = [], ...data } = dto;

      const plan = await tx.rencanaKanvas.create({
        data: {
          id_karyawan: data.id_karyawan,
          id_kendaraan: data.id_kendaraan,
          id_wilayah: data.id_wilayah,
          tanggal: new Date(data.tanggal),
          status: PLAN_STATUS.DRAFT,
          detailRencana: {
            create: detailRencana.map((detail) => ({
              id_outlet: detail.id_outlet,
              urutan: detail.urutan,
            })),
          },
        },
        include: {
          karyawan: true,
          kendaraan: true,
          wilayahKanvas: true,
          detailRencana: { include: { outlet: true } },
        },
      });

      return plan;
    });
  }

  async findAll(query: FindAllPlanDto) {
    const {
      page,
      limit,
      search,
      sortOrder,
      status,
      tanggalStart,
      tanggalEnd,
      id_wilayah,
    } = query;

    const where = {
      ...(status && { status }),
      ...(id_wilayah && { id_wilayah }),
      ...(tanggalStart || tanggalEnd
        ? {
            tanggal: {
              ...(tanggalStart && { gte: new Date(tanggalStart) }),
              ...(tanggalEnd && { lte: new Date(tanggalEnd) }),
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              {
                karyawan: {
                  nama: { contains: search, mode: 'insensitive' as const },
                },
              },
              {
                kendaraan: {
                  nomor_plat: {
                    contains: search,
                    mode: 'insensitive' as const,
                  },
                },
              },
              {
                wilayahKanvas: {
                  nama_wilayah: {
                    contains: search,
                    mode: 'insensitive' as const,
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.rencanaKanvas.findMany({
        where,
        include: {
          karyawan: true,
          kendaraan: true,
          wilayahKanvas: true,
          detailRencana: { include: { outlet: true } },
        },
        orderBy: { id_rencana: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.rencanaKanvas.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number) {
    return this.prisma.rencanaKanvas.findUniqueOrThrow({
      where: { id_rencana: id },
      include: {
        karyawan: true,
        kendaraan: true,
        wilayahKanvas: true,
        detailRencana: { include: { outlet: true } },
      },
    });
  }

  revise(id: number, dto: UpdatePlanDto, _userId: number, _ip: string) {
    return this.prisma.$transaction(async (tx) => {
      const old = await tx.rencanaKanvas.findUniqueOrThrow({
        where: { id_rencana: id },
        include: { detailRencana: true },
      });

      if (old.status === PLAN_STATUS.BATAL) {
        throw new BadRequestException(
          'Tidak dapat merevisi plan yang sudah dibatalkan',
        );
      }

      const {
        detailRencana,
        id_karyawan,
        id_kendaraan,
        id_wilayah,
        tanggal,
      } = dto;

      return tx.rencanaKanvas.update({
        where: { id_rencana: id },
        data: {
          ...(id_karyawan !== undefined && { id_karyawan }),
          ...(id_kendaraan !== undefined && { id_kendaraan }),
          ...(id_wilayah !== undefined && { id_wilayah }),
          ...(tanggal !== undefined && { tanggal: new Date(tanggal) }),
          ...(dto.status !== undefined && { status: dto.status }),
          ...(detailRencana !== undefined && {
            detailRencana: {
              deleteMany: {},
              create: detailRencana.map((detail) => ({
                id_outlet: detail.id_outlet,
                urutan: detail.urutan,
              })),
            },
          }),
        },
        include: {
          karyawan: true,
          kendaraan: true,
          wilayahKanvas: true,
          detailRencana: { include: { outlet: true } },
        },
      });
    });
  }

  updateStatus(
    id: number,
    dto: UpdateStatusPlanDto,
    _userId: number,
    _ip: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const plan = await tx.rencanaKanvas.findUniqueOrThrow({
        where: { id_rencana: id },
      });

      if (plan.status === PLAN_STATUS.BATAL) {
        throw new BadRequestException(
          'Tidak dapat mengubah status plan yang sudah dibatalkan',
        );
      }

      return tx.rencanaKanvas.update({
        where: { id_rencana: id },
        data: { status: dto.status },
      });
    });
  }
}
