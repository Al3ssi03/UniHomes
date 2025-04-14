// 📁 server/chat.js
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

  res.json(chat);
});

module.exports = { chatRoutes: router };