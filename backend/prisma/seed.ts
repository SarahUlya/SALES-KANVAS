
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";
import * as pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

const existingRolePermissions = [
  "plan:read",
  "plan:write",
  "produk:read",
  "produk:write",
];

const permissionNames = [
  ...existingRolePermissions,
  "vehicle:read",
  "vehicle:write",
  "produk-harga:read",
  "produk-harga:write",
  "tipe-harga:read",
  "tipe-harga:write",
  "outlet:read",
  "outlet:write",
  "market-area:read",
  "market-area:write",
  "gudang:read",
  "gudang:write",
  "employee:read",
  "employee:write",
];

async function main() {
  if (!process.env.SUPER_ADMIN_PASSWORD) {
    throw new Error(
      "SUPER_ADMIN_PASSWORD harus diisi di file .env",
    );
  }
  const superAdminRole = await prisma.role.upsert({
    where: { name: "Super Admin" },
    update: {},
    create: { name: "Super Admin" },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin" },
  });

  const salesRole = await prisma.role.upsert({
    where: { name: "Sales" },
    update: {},
    create: { name: "Sales" },
  });

  const permissions = [];

  for (const name of permissionNames) {
    const permission = await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    permissions.push(permission);
  }

  const rolePermissions: Record<string, string[]> = {
    "Super Admin": existingRolePermissions,
    Admin: [
      "plan:read",
      "plan:write",
      "produk:read",
      "produk:write",
      "employee:read",
      "employee:write",
    ],
    Sales: [
      "plan:read",
      "plan:write",
      "produk:read",
    ],
  };

  for (const [roleName, allowedPermissions] of Object.entries(rolePermissions)) {
    const role = await prisma.role.findUniqueOrThrow({
      where: { name: roleName },
    });

    for (const permissionName of allowedPermissions) {
      const permission = permissions.find(
        (item) => item.name === permissionName,
      );

      if (!permission) {
        throw new Error(`Permission tidak ditemukan: ${permissionName}`);
      }

      await prisma.permissionRole.upsert({
        where: {
          permission_id_role_id: {
            role_id: role.id,
            permission_id: permission.id,
          },
        },
        update: {},
        create: {
          role_id: role.id,
          permission_id: permission.id,
        },
      });
    }
  }

  const users = [
    {
      username: process.env.SUPER_ADMIN_USERNAME ?? "superadmin",
      password: process.env.SUPER_ADMIN_PASSWORD ?? "super123",
      roleName: "Super Admin",
      roleId: superAdminRole.id,
    },
    {
      username: process.env.SEED_USERNAME ?? "sales",
      password: process.env.SEED_PASSWORD ?? "password",
      roleName: "Sales",
      roleId: salesRole.id,
    },
    {
      username: process.env.ADMIN_USERNAME ?? "admin",
      password: process.env.ADMIN_PASSWORD ?? "admin123",
      roleName: "Admin",
      roleId: adminRole.id,
    },
  ];

  for (const item of users) {
    const existingUser = await prisma.user.findUnique({
      where: { username: item.username },
    });

    if (existingUser) {
      console.log(`Skipped existing user: ${existingUser.username}`);
    } else {
      const hashedPassword = await bcrypt.hash(item.password, 10);

      await prisma.user.create({
        data: {
          username: item.username,
          password: hashedPassword,
          role: item.roleName,
          role_id: item.roleId,
        },
      });

      console.log(`Created user: ${item.username} (${item.roleName})`);
    }
  }

  console.log("Role, permission, and user-role seeding completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
