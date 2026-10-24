import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';

describe('UserService', () => {
  it('creates separate Kasir and Sales accounts with their shared roles', async () => {
    const userCreate = jest.fn().mockImplementation(({ data }) =>
      Promise.resolve({ id_user: 1, ...data }),
    );
    const transaction = {
      role: {
        findUnique: jest.fn().mockImplementation(({ where }) =>
          Promise.resolve({
            id: where.id,
            name: where.id === 7 ? 'Kasir' : 'Sales',
          }),
        ),
      },
      user: { create: userCreate },
    };
    const prisma = {
      $transaction: jest.fn((callback) => callback(transaction)),
    } as unknown as PrismaService;
    const service = new UserService(prisma);

    const accounts = [
      { username: 'kasir-1', password: 'password-1', role_id: 7, role: 'Kasir' },
      { username: 'kasir-2', password: 'password-2', role_id: 7, role: 'Kasir' },
      { username: 'sales-1', password: 'password-3', role_id: 8, role: 'Sales' },
      { username: 'sales-2', password: 'password-4', role_id: 8, role: 'Sales' },
    ];

    for (const account of accounts) {
      await service.create({
        username: account.username,
        password: account.password,
        role_id: account.role_id,
      });
    }

    for (const [index, account] of accounts.entries()) {
      expect(userCreate).toHaveBeenNthCalledWith(
        index + 1,
        expect.objectContaining({
          data: expect.objectContaining({
            username: account.username,
            role: account.role,
            role_id: account.role_id,
          }),
        }),
      );
    }
  });
});
