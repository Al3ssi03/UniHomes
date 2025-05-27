const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const announcementRoutes = require('./routes/announcements'); // ✅ corretta

require("dotenv").config();

const authRoutes = require('./routes/auth');

// const { authMiddleware, users } = require("./auth"); ← disattivato, lo rifaremo con DB + JWT
const { sendPasswordResetEmail } = require("./mailer");

const PORT = 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes); // <-- giusta posizione
app.use('/api/announcements', announcementRoutes);
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
const passwordResetTokens = new Map();

// 🔒 Queste rotte dovranno essere collegate a utenti reali dal DB con JWT o sessione
app.get("/listings", (req, res) => {
  const { city, type, maxPrice, university } = req.query;
  let filtered = [...listings];

  if (city) {
    filtered = filtered.filter((l) =>
      l.city.toLowerCase().includes(city.toLowerCase())
    );
  }
  if (type) {
    filtered = filtered.filter((l) => l.type === type);
  }
  if (maxPrice) {
    filtered = filtered.filter((l) => l.price <= parseFloat(maxPrice));
  }
  if (university) {
    filtered = filtered.filter((l) =>
      l.university && l.university.toLowerCase().includes(university.toLowerCase())
    );
  }

  res.json(filtered);
});

app.get("/my-listings", /* authMiddleware, */ (req, res) => {
  // ⚠️ authMiddleware va riscritto con JWT o sessione
  res.status(501).json({ message: "Da implementare con autenticazione" });
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  // ⚠️ questa logica era basata su array users in memoria
  // va riscritta quando gli utenti sono persistenti in DB
  return res.status(501).json({ message: "Funzionalità in aggiornamento" });

  /*
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
  */
});

app.post("/reset-password/:token", (req, res) => {
  return res.status(501).json({ message: "Da implementare con DB utenti" });

  /*
  const { token } = req.params;
  const { newPassword } = req.body;
  const email = passwordResetTokens.get(token);

  if (!email) return res.status(400).json({ message: "Token non valido o scaduto" });
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ message: "Utente non trovato" });

  user.password = newPassword;
  passwordResetTokens.delete(token);
  res.json({ message: "Password aggiornata con successo" });
  */
});

app.post("/listings", /* authMiddleware, */ upload.single("image"), (req, res) => {
  // ⚠️ authMiddleware da sostituire con token o sessione

  const {
    title,
    city,
    address,
    price,
    type,
    description,
    university,
    services,
    available_from,
    lat,
    lng
  } = req.body;

  const newListing = {
    id: Date.now(),
    title,
    city,
    address,
    price: parseFloat(price),
    type,
    description,
    university,
    services: JSON.parse(services),
    available_from,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    userId: "dummy", // sostituire con req.user.id da token JWT
    authorName: "Utente", // sostituire con req.user.name
    lat: lat ? parseFloat(lat) : null,
    lng: lng ? parseFloat(lng) : null,
    createdAt: new Date()
  };

  listings.push(newListing);
  res.status(201).json({ message: "Annuncio creato!", listing: newListing });
});

app.get("/listings/:id", (req, res) => {
  const listing = listings.find((l) => l.id === parseInt(req.params.id));
  if (!listing) return res.status(404).json({ message: "Annuncio non trovato" });
  res.json(listing);
});

app.listen(PORT, () =>
  console.log(`✅ Server avviato su http://localhost:${PORT}`)
);
