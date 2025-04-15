// 📁 server/index.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { authRoutes, authMiddleware } = require("./auth");
const app = express();
const PORT = 3001;

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

app.use("/auth", authRoutes);

app.post("/listings", authMiddleware, upload.single("image"), (req, res) => {
  const {
    title,
    city,
    address,
    price,
    type,
    description,
    services,
    available_from,
    university
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
    university,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    userId: req.user.id,
    createdAt: new Date()
  };

  listings.push(newListing);
  res.status(201).json({ message: "Annuncio creato!", listing: newListing });
});

app.get("/listings", (req, res) => {
  res.json(listings);
});

app.get("/listings/:id", (req, res) => {
  const listing = listings.find((l) => l.id === parseInt(req.params.id));
  if (!listing) return res.status(404).json({ message: "Annuncio non trovato" });
  res.json(listing);
});

app.get("/my-listings", authMiddleware, (req, res) => {
  const userListings = listings.filter((l) => l.userId === req.user.id);
  res.json(userListings);
});

app.listen(PORT, () => console.log(`✅ Server avviato su http://localhost:${PORT}`));
