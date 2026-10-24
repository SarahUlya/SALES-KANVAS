
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main() {
  const roles = await prisma.role.findMany({
    include: {
      permissionRoles: {
        include: { permission: true },
      },
    },
    orderBy: { id: "asc" },
  });

  for (const role of roles) {
    const permissions = role.permissionRoles
      .map((item) => item.permission.name)
      .join(", ");

    console.log(`${role.name}: ${permissions}`);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
