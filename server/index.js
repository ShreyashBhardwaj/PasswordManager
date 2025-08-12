const express = require("express");
const app = express();
const mysql = require("mysql");
const port = 3001;

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "(Sanat123$%^)",
  database: "passwordmanager",
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
