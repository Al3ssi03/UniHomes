const express = require('express');
const Message = require('../models/message');
const User = require('../models/user');
const { Op } = require('sequelize');
const { authenticateToken } = require('./auth');
const router = express.Router();

// MIDDLEWARE per verificare autenticazione con JWT
const requireAuth = authenticateToken;

// GET - Recupera tutte le conversazioni dell'utente
router.get('/conversations', requireAuth, async (req, res) => {
  try {
    // Query per trovare tutte le persone con cui l'utente ha scambiato messaggi
    const conversations = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.userId },
          { receiverId: req.userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'Sender',
          attributes: ['id', 'nome', 'cognome', 'username']
        },
        {
          model: User,
          as: 'Receiver',
          attributes: ['id', 'nome', 'cognome', 'username']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Raggruppa per conversazione (partner di chat)
    const conversationsMap = new Map();
    
    conversations.forEach(message => {
      const partnerId = message.senderId === req.userId ? message.receiverId : message.senderId;
      const partner = message.senderId === req.userId ? message.Receiver : message.Sender;
      
      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partnerId,
          partner,
          lastMessage: message,
          unreadCount: 0
        });
      }
    });

    // Conta messaggi non letti per ogni conversazione
    for (let [partnerId, conversation] of conversationsMap) {
      const unreadCount = await Message.count({
        where: {
          senderId: partnerId,
          receiverId: req.userId,
          letto: false
        }
      });
      conversation.unreadCount = unreadCount;
    }
    
    const conversationsList = Array.from(conversationsMap.values());
    
    res.json(conversationsList);
  } catch (error) {
    console.error('Errore recupero conversazioni:', error);
    res.status(500).json({ message: 'Errore durante il recupero delle conversazioni' });
  }
});

// GET - Recupera messaggi tra due utenti
router.get('/conversation/:partnerId', requireAuth, async (req, res) => {
  try {
    const partnerId = parseInt(req.params.partnerId);
    const { page = 1, limit = 50 } = req.query;
    
    const offset = (page - 1) * limit;
    
    const messages = await Message.findAndCountAll({
      where: {
        [Op.or]: [
          { senderId: req.userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: req.userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'Sender',
          attributes: ['id', 'nome', 'cognome', 'username']
        },
        {
          model: User,
          as: 'Receiver',
          attributes: ['id', 'nome', 'cognome', 'username']
        }
      ],
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    // Marca come letti tutti i messaggi ricevuti da questo partner
    await Message.update(
      { letto: true },
      {
        where: {
          senderId: partnerId,
          receiverId: req.userId,
          letto: false
        }
      }
    );
    
    // Recupera info del partner
    const partner = await User.findByPk(partnerId, {
      attributes: ['id', 'nome', 'cognome', 'username']
    });
    
    res.json({
      messages: messages.rows,
      totalCount: messages.count,
      totalPages: Math.ceil(messages.count / limit),
      currentPage: parseInt(page),
      partner
    });
  } catch (error) {
    console.error('Errore recupero messaggi:', error);
    res.status(500).json({ message: 'Errore durante il recupero dei messaggi' });
  }
});

// POST - Invia nuovo messaggio
router.post('/send', requireAuth, async (req, res) => {
  try {
    const { receiverId, contenuto } = req.body;
    
    if (!receiverId || !contenuto) {
      return res.status(400).json({ 
        message: 'ID destinatario e contenuto sono obbligatori' 
      });
    }
    
    if (contenuto.trim().length === 0) {
      return res.status(400).json({ 
        message: 'Il messaggio non può essere vuoto' 
      });
    }
    
    if (receiverId == req.userId) {
      return res.status(400).json({ 
        message: 'Non puoi inviare messaggi a te stesso' 
      });
    }
    
    // Verifica che il destinatario esista
    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Destinatario non trovato' });
    }
    
    const newMessage = await Message.create({
      senderId: req.userId,
      receiverId: parseInt(receiverId),
      contenuto: contenuto.trim()
    });
    
    // Recupera il messaggio con i dati degli utenti
    const messageWithUsers = await Message.findByPk(newMessage.id, {
      include: [
        {
          model: User,
          as: 'Sender',
          attributes: ['id', 'nome', 'cognome', 'username']
        },
        {
          model: User,
          as: 'Receiver',
          attributes: ['id', 'nome', 'cognome', 'username']
        }
      ]
    });
    
    res.status(201).json({
      message: 'Messaggio inviato con successo',
      data: messageWithUsers
    });
  } catch (error) {
    console.error('Errore invio messaggio:', error);
    res.status(500).json({ message: 'Errore durante l\'invio del messaggio' });
  }
});

// PUT - Marca messaggio come letto
router.put('/:messageId/read', requireAuth, async (req, res) => {
  try {
    const messageId = parseInt(req.params.messageId);
    
    const message = await Message.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Messaggio non trovato' });
    }
    
    // Solo il destinatario può marcare come letto
    if (message.receiverId !== req.userId) {
      return res.status(403).json({ message: 'Non autorizzato' });
    }
    
    await message.update({ letto: true });
    
    res.json({ message: 'Messaggio marcato come letto' });
  } catch (error) {
    console.error('Errore aggiornamento messaggio:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del messaggio' });
  }
});

// GET - Conta messaggi non letti
router.get('/unread-count', requireAuth, async (req, res) => {
  try {
    const unreadCount = await Message.count({
      where: {
        receiverId: req.userId,
        letto: false
      }
    });
    
    res.json({ unreadCount });
  } catch (error) {
    console.error('Errore conteggio messaggi non letti:', error);
    res.status(500).json({ message: 'Errore durante il conteggio dei messaggi non letti' });
  }
});

// DELETE - Elimina messaggio (solo mittente)
router.delete('/:messageId', requireAuth, async (req, res) => {
  try {
    const messageId = parseInt(req.params.messageId);
    
    const message = await Message.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Messaggio non trovato' });
    }
    
    // Solo il mittente può eliminare il messaggio
    if (message.senderId !== req.userId) {
      return res.status(403).json({ message: 'Non autorizzato a eliminare questo messaggio' });
    }
    
    await message.destroy();
    
      res.json({ message: 'Messaggio eliminato con successo' });
    } catch (error) {
      console.error('Errore eliminazione messaggio:', error);
      res.status(500).json({ message: 'Errore durante l\'eliminazione del messaggio' });
    }
  });
  
  module.exports = router;