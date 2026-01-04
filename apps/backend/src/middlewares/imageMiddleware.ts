import multer from "multer";
import os from "os";
import path from "path";

const tmpDir = path.join(os.tmpdir(), "avatars");

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, tmpDir)
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

export const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("画像ファイルのみ対応"));
    } else {
      cb(null, true);
    }
  }, })


  