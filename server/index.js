// 📁 server/index.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { authRoutes, authMiddleware } = require("./auth");
const { sendPasswordResetEmail } = require("./mailer");
const app = express();
const PORT = 3001;

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const listings = [];
const users = []; // array utenti fittizi
const passwordResetTokens = new Map();

app.use("/auth", authRoutes);

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ message: "Utente non trovato" });

  const token = crypto.randomBytes(32).toString("hex");
  passwordResetTokens.set(token, user.email);

  try {
    await sendPasswordResetEmail(email, token);
    res.json({ message: "Email inviata con successo" });
  } catch (err) {
    console.error("Errore invio email:", err);
    res.status(500).json({ message: "Errore nell'invio dell'email" });
  }
});

app.post("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const email = passwordResetTokens.get(token);

  if (!email) return res.status(400).json({ message: "Token non valido o scaduto" });
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ message: "Utente non trovato" });

  user.password = newPassword;
  passwordResetTokens.delete(token);
  res.json({ message: "Password aggiornata con successo" });
});

app.listen(PORT, () => console.log(`✅ Server avviato su http://localhost:${PORT}`));