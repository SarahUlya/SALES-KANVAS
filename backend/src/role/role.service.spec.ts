import { PrismaService } from '../prisma/prisma.service';
import { RoleService } from './role.service';

describe('RoleService', () => {
  it('updates the stored role name for users assigned to a renamed role', async () => {
    const roleUpdate = jest.fn().mockResolvedValue({
      id: 7,
      name: 'Kasir',
      permissionRoles: [],
    });
    const userUpdateMany = jest.fn().mockResolvedValue({ count: 2 });
    const transaction = {
      role: { update: roleUpdate },
      user: { updateMany: userUpdateMany },
    };
    const prisma = {
      role: {
        findUnique: jest
          .fn()
          .mockResolvedValueOnce({ id: 7, name: 'Kasir Lama' })
          .mockResolvedValueOnce({ id: 7 }),
      },
      $transaction: jest.fn((callback) => callback(transaction)),
    } as unknown as PrismaService;
    const service = new RoleService(prisma);

    await service.update(7, { name: 'Kasir' });

    expect(roleUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 7 },
        data: { name: 'Kasir' },
      }),
    );
    expect(userUpdateMany).toHaveBeenCalledWith({
      where: { role_id: 7 },
      data: { role: 'Kasir' },
    });
  });
});
