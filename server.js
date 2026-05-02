const express = require("express");
const multer = require("multer");

const app = express();

app.use(express.static("public"));
app.use(express.json());

// File upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

let documents = [];

// Submit document
app.post("/submit", upload.single("file"), (req, res) => {
    const doc = {
        id: documents.length + 1,
        title: req.body.title,
        file: req.file.filename,
        status: "Pending"
    };
    documents.push(doc);
    res.send(doc);
});

// Get documents
app.get("/docs", (req, res) => {
    res.send(documents);
});

// Approve
app.post("/approve/:id", (req, res) => {
    const doc = documents.find(d => d.id == req.params.id);
    if (doc) doc.status = "Approved";
    res.send(doc);
});

// Reject
app.post("/reject/:id", (req, res) => {
    const doc = documents.find(d => d.id == req.params.id);
    if (doc) doc.status = "Rejected";
    res.send(doc);
});

app.listen(3000, () => console.log("Server running on port 3000"));