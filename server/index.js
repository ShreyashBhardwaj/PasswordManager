const express = require("express");
const app = express();
const mysql = require("mysql2");
const port = 3001;
const cors = require("cors");

const { encrypt, decrypt } = require("./EncryptionHandler");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "(Sanat123$%^)", // Replace with your actual password
  database: "passwordmanager",
});

app.post("/addpassword", (req, res) => {
  const { passwords, title } = req.body;
  const encryptedPassword = encrypt(passwords);

  db.query(
    "Insert into passwords (password,website,iv) values (?, ?, ?)",
    [encryptedPassword.password, title, encryptedPassword.iv],
    (err, result) => {
      if (err) {
        console.error("Error inserting password:", err);
        res.status(500).send("Error inserting password");
      } else {
        console.log("Password added successfully");
        res.status(200).send("Password added successfully");
      }
    }
  );
});

app.get("/getpasswords", (req, res) => {
  db.query("Select * from passwords", (err, result) => {
    if (err) {
      console.log("Error fetching passwords:", err);
    } else {
      res.send(result);
    }
  });
});

app.post("/decryptpassword", (req, res) => {
  res.send(decrypt(req.body));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
