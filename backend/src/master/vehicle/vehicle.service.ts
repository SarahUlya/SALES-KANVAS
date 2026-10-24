
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVehicleDto, UpdateVehicleDto } from './vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.kendaraan.findMany({
      orderBy: { nomor_plat: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.kendaraan.findUniqueOrThrow({
      where: { id_kendaraan: id },
    });
  }

  create(dto: CreateVehicleDto, _userId: number, _ip: string) {
    return this.prisma.kendaraan.create({
      data: {
        nomor_plat: dto.nomor_plat,
        jenis: dto.jenis,
        status: dto.status,
      },
    });
  }

  update(id: number, dto: UpdateVehicleDto, _userId: number, _ip: string) {
    return this.prisma.kendaraan.update({
      where: { id_kendaraan: id },
      data: {
        ...(dto.nomor_plat !== undefined && {
          nomor_plat: dto.nomor_plat,
        }),
        ...(dto.jenis !== undefined && { jenis: dto.jenis }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });
  }

  remove(id: number) {
    return this.prisma.kendaraan.delete({
      where: { id_kendaraan: id },
    });
  }
}
