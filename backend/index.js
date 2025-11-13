const express = require("express");
const { query } = require("./db");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// DB 接続テスト用
app.get("/api/db-check", async (req, res) => {
  try {
    const rows = await query("SELECT NOW() AS now");
    res.json({
      status: "オッケーです",
      now: rows[0].now,
    });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});