import pkg from 'pg';
const { Pool } = pkg;

  
 export const pool = new Pool({
    user: 'db_rcb83hhc3zpj',
    host: 'up-de-fra1-postgresql-1.db.run-on-seenode.com',
    database: 'db_rcb83hhc3zpj',
    password: '7nlSUXRIu7AVqfBbqrLwLpyX',
    port: 11550,
    ssl: { rejectUnauthorized: false } // 🔹 importante si tu proveedor usa SSL
  });

