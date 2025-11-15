const express = require("express");
const { query } = require("./db");
const { smtp, mailOptions } = require("./mailer");
const { minioClient, bucketName } =  require("./minio");

const app = express();
const port = 3000;

app.use(express.json());

// nginx接続テスト用
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// mailhog接続テスト用
app.get("/api/mailhog-check", (req, res) => {
  smtp.sendMail(mailOptions, function(err, info) {
  if (!err) {
    res.json({
      status: 'Mail success: '
    });
  } else {
    res.json({
      status: "mail Failure" + err
    })
  }
  smtp.close();
});
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

// ファイルダウンロード
app.get("/files/:name", async (req, res) => {
  try {
    const stream = await minioClient.getObject(bucketName, req.params.name);

    stream.on("error", (err) => {
      console.error(err);
      res.status(404).json({ error: "not found" });
    });

    // とりあえずそのまま返す（本当は Content-Type を保存しておいても良い）
    stream.pipe(res);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "download failed" });
  }
});


app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});