const express = require("express");
const app = express();
const mysql = require("mysql");
const port = 3001;

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "(Sanat123$%^)", // Replace with your actual password
  database: "passwordmanager",
});

app.get("/addpassword", (req, res) => {});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
