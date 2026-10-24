import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateRoleDto,
  UpdateRoleDto,
  UpdateRolePermissionsDto,
} from './role.dto';

const roleInclude = {
  permissionRoles: {
    include: {
      permission: {
        select: { id: true, name: true },
      },
    },
  },
} as const;

type RoleWithPermissions = Prisma.RoleGetPayload<{
  include: typeof roleInclude;
}>;

function toRoleResponse(role: RoleWithPermissions) {
  const { permissionRoles, ...roleData } = role;
  return {
    ...roleData,
    permissions: permissionRoles.map(({ permission }) => permission),
  };
}

function isSuperAdminRoleName(name: string) {
  const normalizedName = name.trim().toLowerCase();
  return normalizedName === 'super admin' || normalizedName === 'superadmin';
}

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const roles = await this.prisma.role.findMany({
      orderBy: { name: 'asc' },
      include: roleInclude,
    });

    return roles.map(toRoleResponse);
  }

  findAllPermissions() {
    return this.prisma.permission.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: roleInclude,
    });

    if (!role) {
      throw new NotFoundException(`Role dengan ID ${id} tidak ditemukan`);
    }

    return toRoleResponse(role);
  }

  async create(dto: CreateRoleDto) {
    if (isSuperAdminRoleName(dto.name)) {
      throw new ConflictException('Nama role Super Admin tidak dapat digunakan');
    }

    const existingRole = await this.prisma.role.findUnique({
      where: { name: dto.name },
      select: { id: true },
    });

    if (existingRole) {
      throw new ConflictException(`Role "${dto.name}" sudah tersedia`);
    }

    try {
      const createdRole = await this.prisma.role.create({
        data: { name: dto.name },
        include: roleInclude,
      });
      return toRoleResponse(createdRole);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`Role "${dto.name}" sudah tersedia`);
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!role) {
      throw new NotFoundException(`Role dengan ID ${id} tidak ditemukan`);
    }

    if (
      (isSuperAdminRoleName(role.name) || isSuperAdminRoleName(dto.name)) &&
      role.name !== dto.name
    ) {
      throw new ConflictException(
        'Nama role Super Admin tidak dapat diubah atau digunakan',
      );
    }

    const existingRole = await this.prisma.role.findUnique({
      where: { name: dto.name },
      select: { id: true },
    });

    if (existingRole && existingRole.id !== id) {
      throw new ConflictException(`Role "${dto.name}" sudah tersedia`);
    }

    try {
      const updatedRole = await this.prisma.$transaction(async (transaction) => {
        const role = await transaction.role.update({
          where: { id },
          data: { name: dto.name },
          include: roleInclude,
        });
        await transaction.user.updateMany({
          where: { role_id: id },
          data: { role: dto.name },
        });
        return role;
      });
      return toRoleResponse(updatedRole);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`Role "${dto.name}" sudah tersedia`);
      }
      throw error;
    }
  }

  async updatePermissions(id: number, dto: UpdateRolePermissionsDto) {
    return this.prisma.$transaction(async (transaction) => {
      const role = await transaction.role.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!role) {
        throw new NotFoundException(`Role dengan ID ${id} tidak ditemukan`);
      }

      const permissions = await transaction.permission.findMany({
        where: { id: { in: dto.permission_ids } },
        select: { id: true },
      });
      const foundIds = new Set(
        permissions.map(({ id: permissionId }) => permissionId),
      );
      const invalidIds = dto.permission_ids.filter(
        (permissionId) => !foundIds.has(permissionId),
      );

      if (invalidIds.length > 0) {
        throw new BadRequestException(
          `Permission ID tidak ditemukan: ${invalidIds.join(', ')}`,
        );
      }

      await transaction.permissionRole.deleteMany({
        where: { role_id: id },
      });

      if (dto.permission_ids.length > 0) {
        await transaction.permissionRole.createMany({
          data: dto.permission_ids.map((permission_id) => ({
            role_id: id,
            permission_id,
          })),
        });
      }

      const updatedRole = await transaction.role.findUniqueOrThrow({
        where: { id },
        include: roleInclude,
      });
      return toRoleResponse(updatedRole);
    });
  }

  async remove(id: number) {
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const role = await transaction.role.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            _count: { select: { users: true } },
          },
        });

        if (!role) {
          throw new NotFoundException(`Role dengan ID ${id} tidak ditemukan`);
        }

        if (isSuperAdminRoleName(role.name)) {
          throw new ConflictException('Role Super Admin tidak dapat dihapus');
        }

        if (role._count.users > 0) {
          throw new ConflictException(
            'Role tidak dapat dihapus karena masih ditetapkan kepada user',
          );
        }

        return transaction.role.delete({ where: { id } });
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new ConflictException(
          'Role tidak dapat dihapus karena masih memiliki relasi aktif',
        );
      }
      throw error;
    }
  }
}
