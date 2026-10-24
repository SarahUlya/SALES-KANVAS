require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    const result = await pool.query(`
      SELECT id_user, username, role, role_id
      FROM "user"
      ORDER BY id_user;
    `);

    console.table(result.rows);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
