// 📁 server/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const users = []; // temporaneo - salva utenti in memoria
const JWT_SECRET = "supersegreto123"; // da spostare in .env

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = users.find((u) => u.email === email);
  if (existing) return res.status(400).json({ message: "Utente già registrato" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    name,
    email,
    passwordHash: hashed,
    role: role || "tenant",
  };
  users.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.status(201).json({ token });
});


// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ message: "Credenziali non valide" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Credenziali non valide" });

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token }); // << mancava!
});


// Middleware di autenticazione
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token mancante" });

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  try {
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email // se vuoi, opzionale
    };
    
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token non valido" });
  }
}

module.exports = { authRoutes: router, authMiddleware, users };
