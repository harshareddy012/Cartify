require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DB_URL });

async function drop() {
  try {
    await pool.query('DROP TABLE IF EXISTS comments, products, users CASCADE;');
    console.log('Tables dropped successfully.');
  } catch (error) {
    console.error('Error dropping tables:', error);
  } finally {
    pool.end();
  }
}

drop();
