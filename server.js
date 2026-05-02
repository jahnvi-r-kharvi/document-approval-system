const express = require("express");
const app = express();

app.use(express.json());

let docs = [];

app.post("/submit", (req, res) => {
    const doc = {
        id: docs.length + 1,
        title: req.body.title,
        status: "Pending"
    };
    docs.push(doc);
    res.send(doc);
});

app.get("/docs", (req, res) => {
    res.send(docs);
});

app.post("/approve/:id", (req, res) => {
    const doc = docs.find(d => d.id == req.params.id);
    if (doc) {
        doc.status = "Approved";
        res.send(doc);
    } else {
        res.send("Not found");
    }
});

app.listen(3000, () => console.log("Server running"));