const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const sculpturesStore = require("./sculpturesStore");

const app = express();
const PORT = 4000;

// Папка для загрузки файлов
const UPLOADS_DIR = path.join(__dirname, "uploads");

// Убедимся, что папка uploads существует
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Настройка multer: сохраняем файлы в uploads/ с уникальными именами
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

app.use(cors());

// JSON нужен только для других маршрутов, не для upload
app.use(express.json());

// раздаём статику из папки uploads по пути /uploads/...
app.use("/uploads", express.static(UPLOADS_DIR));

// получить все скульптуры
app.get("/api/sculptures", (req, res) => {
  res.json(sculpturesStore.getAll());
});

// добавить новую скульптуру (title + несколько файлов)
app.post(
  "/api/sculptures",
  upload.array("images", 20), // "images" — имя поля в FormData
  (req, res) => {
    const { title } = req.body;
    const files = req.files || [];

    if (!title || files.length === 0) {
      return res
        .status(400)
        .json({ error: "title and at least one image file required" });
    }

    // формируем URL для каждой загруженной картинки
    const imageUrls = files.map((file) => {
      // ссылка, по которой фронт сможет получить картинку
      return `http://localhost:${PORT}/uploads/${file.filename}`;
    });

    const created = sculpturesStore.addSculpture(title, imageUrls);
    res.status(201).json(created);
  }
);

// удалить скульптуру
app.delete("/api/sculptures/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "invalid id" });
  }
  const ok = sculpturesStore.removeSculpture(id);
  if (!ok) {
    return res.status(404).json({ error: "not found" });
  }
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
