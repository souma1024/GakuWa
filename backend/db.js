const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "admin",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "gakuwa_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 共通で使う query 関数
async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = {
  pool,
  query,
};