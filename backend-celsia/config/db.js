import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'herramentales_db',
  password: '12345678',
  port: 5432,
});
