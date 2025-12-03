import mysql from 'mysql2/promise'

function getConfig() {
  const databaseUrl = process.env.DATABASE_URL
  if (databaseUrl) {
    const u = new URL(databaseUrl)
    return {
      host: u.hostname,
      port: Number(u.port) || 3306,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, ''),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }
  }
  return {
    host: process.env.DB_HOST || 'db',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }
}

const pool = mysql.createPool(getConfig())

export default pool
