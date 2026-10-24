import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { EmployeeService } from './employee.service';

describe('EmployeeService', () => {
  const create = jest.fn();
  const findMany = jest.fn();
  const prisma = {
    karyawan: { create },
    user: { findMany },
  } as unknown as PrismaService;
  const service = new EmployeeService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists only user accounts that are not linked to an employee', async () => {
    findMany.mockResolvedValue([]);

    await service.findAvailableUsers();

    expect(findMany).toHaveBeenCalledWith({
      where: { karyawan: { is: null } },
      orderBy: { username: 'asc' },
      select: { id_user: true, username: true },
    });
  });

  it('links different user accounts to different employees', async () => {
    create.mockImplementation(({ data }: { data: { id_user: number } }) =>
      Promise.resolve(data),
    );

    await service.create(
      { id_user: 10, nama: 'Kasir 1', no_hp: null, status: 'aktif' },
      1,
      '127.0.0.1',
    );
    await service.create(
      { id_user: 11, nama: 'Kasir 2', no_hp: null, status: 'aktif' },
      1,
      '127.0.0.1',
    );

    expect(create).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ data: expect.objectContaining({ id_user: 10 }) }),
    );
    expect(create).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ data: expect.objectContaining({ id_user: 11 }) }),
    );
  });

  it('rejects linking a user that is already linked to an employee', async () => {
    create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    await expect(
      service.create(
        { id_user: 10, nama: 'Karyawan lain', no_hp: null, status: 'aktif' },
        1,
        '127.0.0.1',
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
