require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('role', 'permission', 'permission_role')
      ORDER BY table_name;
    `);

    console.log("Tabel yang ditemukan:", result.rows);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
