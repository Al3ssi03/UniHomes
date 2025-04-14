// 📁 server/index.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { authRoutes, authMiddleware, users } = require("./auth");
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer setup per gestione upload immagini
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

// In-memory storage temporaneo (puoi sostituirlo con un DB)
const listings = [];

// Auth routes
app.use("/auth", authRoutes);

// Endpoint POST per ricevere nuovi annunci
app.post("/listings", authMiddleware, upload.single("images"), (req, res) => {
  const {
    title,
    city,
    address,
    price,
    type,
    description,
    services,
    available_from
  } = req.body;

  const newListing = {
    id: listings.length + 1,
    title,
    city,
    address,
    price: parseFloat(price),
    type,
    description,
    services: JSON.parse(services),
    available_from,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    userId: req.user.id,
    createdAt: new Date()
  };

  listings.push(newListing);
  res.status(201).json({ message: "Annuncio creato!", listing: newListing });
});

// Endpoint GET per ottenere tutti gli annunci
app.get("/listings", (req, res) => {
  res.json(listings);
});

// Endpoint GET per ottenere un singolo annuncio
app.get("/listings/:id", (req, res) => {
  const listing = listings.find((l) => l.id === parseInt(req.params.id));
  if (!listing) return res.status(404).json({ message: "Annuncio non trovato" });
  res.json(listing);
});

// Endpoint GET per ottenere gli annunci dell'utente autenticato
app.get("/my-listings", authMiddleware, (req, res) => {
  const userListings = listings.filter((l) => l.userId === req.user.id);
  res.json(userListings);
});

// Endpoint PUT per modificare un annuncio
app.put("/listings/:id", authMiddleware, (req, res) => {
  const listing = listings.find((l) => l.id === parseInt(req.params.id));
  if (!listing) return res.status(404).json({ message: "Annuncio non trovato" });
  if (listing.userId !== req.user.id) return res.status(403).json({ message: "Non autorizzato" });

  const { title, city, address, price, type, description, services, available_from } = req.body;
  if (title) listing.title = title;
  if (city) listing.city = city;
  if (address) listing.address = address;
  if (price) listing.price = parseFloat(price);
  if (type) listing.type = type;
  if (description) listing.description = description;
  if (services) listing.services = JSON.parse(services);
  if (available_from) listing.available_from = available_from;

  res.json({ message: "Annuncio aggiornato", listing });
});

// Endpoint DELETE per rimuovere un annuncio
app.delete("/listings/:id", authMiddleware, (req, res) => {
  const index = listings.findIndex((l) => l.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Annuncio non trovato" });
  if (listings[index].userId !== req.user.id) return res.status(403).json({ message: "Non autorizzato" });

  listings.splice(index, 1);
  res.json({ message: "Annuncio eliminato" });
});

// Start server
app.listen(PORT, () => console.log(`✅ Server avviato su http://localhost:${PORT}`));
