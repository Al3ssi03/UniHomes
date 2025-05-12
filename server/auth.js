// 📁 server/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const users = []; // array utenti fittizi
const JWT_SECRET = "supersegreto123"; // da spostare in .env

// REGISTER
router.post("/register", async (req, res) => {
  const { firstName, lastName, birthYear, phone, email, password } = req.body;
  const existing = users.find((u) => u.email === email);
  if (existing) return res.status(400).json({ message: "Utente già registrato" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    firstName,
    lastName,
    birthYear,
    phone,
    email,
    passwordHash: hashed,
    role: "tenant",
  };
  users.push(newUser);

  const token = jwt.sign(
    {
      id: newUser.id,
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      role: newUser.role,
    },
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
    {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
});

// Middleware di autenticazione
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token mancante" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token non valido" });
  }
}

module.exports = { authRoutes: router, authMiddleware, users };
