const express = require("express");
const multer = require("multer");
const fs = require("fs");

const app = express();

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());

// ✅ ENSURE uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

let documents = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "_"))
});

const upload = multer({ storage });

// ---------------- UPLOAD ----------------
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const doc = {
      id: Date.now(),
      title: req.body.title || "Untitled",
      file: req.file.filename,
      status: "pending"
    };

    documents.push(doc);

    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ---------------- PENDING ----------------
app.get("/documents", (req, res) => {
  res.json(documents.filter(d => d.status === "pending"));
});

// ---------------- APPROVED ----------------
app.get("/approved", (req, res) => {
  res.json(documents.filter(d => d.status === "approved"));
});

// ---------------- APPROVE ----------------
app.post("/approve/:id", (req, res) => {
  const id = Number(req.params.id);

  documents.forEach(d => {
    if (d.id === id) d.status = "approved";
  });

  res.json({ message: "approved" });
});

// ---------------- REJECT ----------------
app.post("/reject/:id", (req, res) => {
  const id = Number(req.params.id);

  documents.forEach(d => {
    if (d.id === id) d.status = "rejected";
  });

  res.json({ message: "rejected" });
});
app.get("/test", (req, res) => {
  res.send("Backend working");
});
// ---------------- SERVER ----------------
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});