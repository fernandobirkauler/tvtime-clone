import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;
let schemaReady = false;

export async function db() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "trakt",
      password: process.env.DB_PASSWORD || "trakt123",
      database: process.env.DB_NAME || "trakt",
    });
  }
  if (!schemaReady) {
    await initSchema();
    schemaReady = true;
  }
  return pool;
}

async function initSchema() {
  const conn = await pool!.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(191) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        token VARCHAR(64) PRIMARY KEY,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS user_media (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        media_type ENUM('movie','tv') NOT NULL,
        media_id INT NOT NULL,
        title VARCHAR(500),
        poster_path VARCHAR(500),
        vote_average FLOAT,
        runtime INT,
        status ENUM('watchlist','watched','abandoned') NOT NULL,
        watched_at DATETIME NULL,
        show_id INT NULL,
        show_title VARCHAR(500) NULL,
        UNIQUE KEY uniq (user_id, media_type, media_id, status)
      )`);
  } finally {
    conn.release();
  }
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  const p = await db();
  const [rows] = await p.execute(sql, params);
  return rows as T;
}
