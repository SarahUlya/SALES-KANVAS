
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateEmployeeDto, UpdateEmployeeDto } from "./employee.dto";

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  // List karyawan
  findAll() {
    return this.prisma.karyawan.findMany({
      orderBy: { nama: "asc" },
      include: {
        user: {
          select: { username: true },
        },
      },
    });
  }

  findAvailableUsers() {
    return this.prisma.user.findMany({
      where: { karyawan: { is: null } },
      orderBy: { username: "asc" },
      select: {
        id_user: true,
        username: true,
      },
    });
  }

  // Detail karyawan berdasarkan ID
  findOne(id: number) {
    return this.prisma.karyawan.findUniqueOrThrow({
      where: { id_karyawan: id },
    });
  }

  // Buat karyawan
  async create(dto: CreateEmployeeDto, _userId: number, _ip: string) {
    try {
      return await this.prisma.karyawan.create({
        data: {
          id_user: dto.id_user,
          nama: dto.nama,
          no_hp: dto.no_hp,
          status: dto.status,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException(
          "Akun User sudah terhubung ke Karyawan lain",
        );
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        throw new NotFoundException(
          `Akun User dengan ID ${dto.id_user} tidak ditemukan`,
        );
      }
      throw error;
    }
  }

  
  // Perbarui karyawan
  update(id: number, dto: UpdateEmployeeDto, _userId: number, _ip: string) {
    return this.prisma.karyawan.update({
      where: { id_karyawan: id },
      data: {
        ...(dto.nama !== undefined && { nama: dto.nama }),
        ...(dto.no_hp !== undefined && { no_hp: dto.no_hp }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });
  }

}
