const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Announcement = require('../models/announcement');
const User = require('../models/user');

// Upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Crea annuncio
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      titolo,
      descrizione,
      prezzo,
      città,
      indirizzo,
      lat,
      lng,
      userId
    } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const annuncio = await Announcement.create({
      titolo,
      descrizione,
      prezzo,
      città,
      indirizzo,
      immagini: imageUrl ? [imageUrl] : [],
      lat,
      lng,
      userId
    });

    res.status(201).json({ message: "Annuncio creato", annuncio });
  } catch (error) {
    console.error("Errore creazione annuncio:", error);
    res.status(500).json({ message: "Errore server" });
  }
});

// Tutti gli annunci
router.get("/", async (req, res) => {
  const annunci = await Announcement.findAll({ include: User });
  res.json(annunci);
});

// Annuncio singolo
router.get("/:id", async (req, res) => {
  const annuncio = await Announcement.findByPk(req.params.id, { include: User });
  if (!annuncio) return res.status(404).json({ message: "Annuncio non trovato" });
  res.json(annuncio);
});

// Annunci per utente
router.get("/user/:userId", async (req, res) => {
  const annunci = await Announcement.findAll({
    where: { userId: req.params.userId },
    include: User
  });
  res.json(annunci);
});

module.exports = router;
