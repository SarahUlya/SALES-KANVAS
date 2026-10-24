import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserDto,
  ResetUserPasswordDto,
  UpdateUserRoleDto,
  UpdateUsernameDto,
} from './user.dto';

const userSelect = {
  id_user: true,
  username: true,
  role: true,
  role_id: true,
  roleRelation: {
    select: { id: true, name: true },
  },
  karyawan: {
    select: {
      id_karyawan: true,
      nama: true,
      no_hp: true,
      status: true,
    },
  },
} as const;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { username: 'asc' },
      select: userSelect,
    });
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      return await this.prisma.$transaction(async (transaction) => {
        const role = await transaction.role.findUnique({
          where: { id: dto.role_id },
          select: { id: true, name: true },
        });

        if (!role) {
          throw new NotFoundException(
            `Role dengan ID ${dto.role_id} tidak ditemukan`,
          );
        }
        this.ensureRoleNameFitsUserColumn(role.name);

        return transaction.user.create({
          data: {
            username: dto.username,
            password: hashedPassword,
            role: role.name,
            role_id: role.id,
          },
          select: userSelect,
        });
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Username "${dto.username}" sudah digunakan`,
        );
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundException(
          `Role dengan ID ${dto.role_id} tidak ditemukan`,
        );
      }
      throw error;
    }
  }

  async updateRole(id: number, dto: UpdateUserRoleDto) {
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const user = await transaction.user.findUnique({
          where: { id_user: id },
          select: { id_user: true },
        });

        if (!user) {
          throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
        }

        const role = await transaction.role.findUnique({
          where: { id: dto.role_id },
          select: { id: true, name: true },
        });

        if (!role) {
          throw new NotFoundException(
            `Role dengan ID ${dto.role_id} tidak ditemukan`,
          );
        }
        this.ensureRoleNameFitsUserColumn(role.name);

        return transaction.user.update({
          where: { id_user: id },
          data: {
            role: role.name,
            role_id: role.id,
          },
          select: userSelect,
        });
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundException(
          `Role dengan ID ${dto.role_id} tidak ditemukan`,
        );
      }
      throw error;
    }
  }

  async updateUsername(id: number, dto: UpdateUsernameDto) {
    try {
      return await this.prisma.user.update({
        where: { id_user: id },
        data: { username: dto.username },
        select: userSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Username sudah digunakan');
      }
      throw error;
    }
  }

  async resetPassword(id: number, dto: ResetUserPasswordDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      return await this.prisma.user.update({
        where: { id_user: id },
        data: { password: hashedPassword },
        select: userSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
      }
      throw error;
    }
  }

  private ensureRoleNameFitsUserColumn(roleName: string) {
    if (roleName.length > 20) {
      throw new BadRequestException(
        'Nama role melebihi kapasitas kolom User.role (20 karakter)',
      );
    }
  }
}
