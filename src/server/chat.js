const express = require("express");
const { authMiddleware } = require("./auth");
const router = express.Router();

const messages = []; // In-memory store per i messaggi

// Invia un messaggio
router.post("/messages", authMiddleware, (req, res) => {
  const { receiverId, listingId, content } = req.body;

  if (!receiverId || !listingId || !content) {
    return res.status(400).json({ message: "Tutti i campi sono obbligatori" });
  }

  const newMessage = {
    id: messages.length + 1,
    senderId: req.user.id,
    receiverId: parseInt(receiverId),
    listingId: parseInt(listingId),
    content,
    read: false,
    timestamp: new Date().toISOString(),
  };

  messages.push(newMessage);
  res.status(201).json(newMessage);
});

// Recupera tutti i messaggi per un annuncio specifico
router.get("/messages/:listingId", authMiddleware, (req, res) => {
  const listingId = parseInt(req.params.listingId);
  const userId = req.user.id;

  const chat = messages.filter(
    (msg) =>
      msg.listingId === listingId &&
      (msg.senderId === userId || msg.receiverId === userId)
  );

  // Segna come letti i messaggi ricevuti dall'utente autenticato
  chat.forEach((msg) => {
    if (msg.receiverId === userId) msg.read = true;
  });

  res.json(chat);
});

// Recupera le notifiche non lette per l'utente loggato
router.get("/notifications", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const unread = messages.filter((msg) => msg.receiverId === userId && !msg.read);
  res.json(unread);
});

module.exports = { chatRoutes: router };
