const express = require('express');
const multer = require('multer');
const path = require('path');
const Announcement = require('../models/announcement');
const User = require('../models/user');
const { Op } = require('sequelize');
const { authenticateToken } = require('./auth');
const router = express.Router();

// Configurazione multer per upload immagini
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo immagini sono consentite (jpeg, jpg, png, webp)'));
    }
  }
});

// MIDDLEWARE per verificare autenticazione con JWT
const requireAuth = authenticateToken;

// GET - Recupera tutti gli annunci con filtri
router.get('/', async (req, res) => {
  try {
    const { citta, prezzoMin, prezzoMax, tipologia, stanze, page = 1, limit = 10 } = req.query;
    
    // Costruisci la query dinamicamente
    const whereClause = {};
    
    if (citta && citta !== '') {
      whereClause.città = {
        [Op.iLike]: `%${citta}%` // Case insensitive search
      };
    }
    
    if (prezzoMin || prezzoMax) {
      whereClause.prezzo = {};
      if (prezzoMin) whereClause.prezzo[Op.gte] = parseFloat(prezzoMin);
      if (prezzoMax) whereClause.prezzo[Op.lte] = parseFloat(prezzoMax);
    }
    
    // Se hai un campo tipologia nel model, aggiungi:
    // if (tipologia) whereClause.tipologia = tipologia;
    
    const offset = (page - 1) * limit;
    
    const announcements = await Announcement.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        attributes: ['id', 'nome', 'cognome', 'username'] // Non includere password_hash
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      announcements: announcements.rows,
      totalCount: announcements.count,
      totalPages: Math.ceil(announcements.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Errore recupero annunci:', error);
    res.status(500).json({ message: 'Errore durante il recupero degli annunci' });
  }
});

// GET - Recupera singolo annuncio per ID
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['id', 'nome', 'cognome', 'username', 'telefono']
      }]
    });
    
    if (!announcement) {
      return res.status(404).json({ message: 'Annuncio non trovato' });
    }
    
    res.json(announcement);
  } catch (error) {
    console.error('Errore recupero annuncio:', error);
    res.status(500).json({ message: 'Errore durante il recupero dell\'annuncio' });
  }
});

// POST - Crea nuovo annuncio
router.post('/', requireAuth, upload.array('immagini', 5), async (req, res) => {
  try {
    const { titolo, descrizione, prezzo, città, indirizzo, lat, lng } = req.body;
    
    // Validation
    if (!titolo || !prezzo || !città) {
      return res.status(400).json({ 
        message: 'Titolo, prezzo e città sono obbligatori' 
      });
    }
    
    // Processa le immagini caricate
    const immaginiPaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const newAnnouncement = await Announcement.create({
      titolo,
      descrizione,
      prezzo: parseFloat(prezzo),
      città,
      indirizzo,
      immagini: immaginiPaths,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      userId: req.userId
    });
    
    // Recupera l'annuncio con i dati dell'utente
    const announcementWithUser = await Announcement.findByPk(newAnnouncement.id, {
      include: [{
        model: User,
        attributes: ['id', 'nome', 'cognome', 'username']
      }]
    });
    
    res.status(201).json({
      message: 'Annuncio creato con successo',
      announcement: announcementWithUser
    });
  } catch (error) {
    console.error('Errore creazione annuncio:', error);
    res.status(500).json({ message: 'Errore durante la creazione dell\'annuncio' });
  }
});

// POST - Route temporanea per annunci senza immagini (JSON)
router.post('/simple', requireAuth, async (req, res) => {
  try {
    const { titolo, descrizione, prezzo, città, indirizzo, lat, lng } = req.body;
    
    // Validation
    if (!titolo || !prezzo || !città) {
      return res.status(400).json({ 
        message: 'Titolo, prezzo e città sono obbligatori' 
      });
    }
    
    const newAnnouncement = await Announcement.create({
      titolo,
      descrizione,
      prezzo: parseFloat(prezzo),
      città,
      indirizzo,
      immagini: [], // Nessuna immagine
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      userId: req.userId
    });
    
    // Recupera l'annuncio con i dati dell'utente
    const announcementWithUser = await Announcement.findByPk(newAnnouncement.id, {
      include: [{
        model: User,
        attributes: ['id', 'nome', 'cognome', 'username']
      }]
    });
    
    res.status(201).json({
      message: 'Annuncio creato con successo',
      announcement: announcementWithUser
    });
  } catch (error) {
    console.error('Errore creazione annuncio:', error);
    res.status(500).json({ message: 'Errore durante la creazione dell\'annuncio' });
  }
});

// PUT - Modifica annuncio (solo proprietario)
router.put('/:id', requireAuth, upload.array('nuove_immagini', 5), async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Annuncio non trovato' });
    }
    
    // Verifica che l'utente sia il proprietario
    if (announcement.userId != req.userId) {
      return res.status(403).json({ message: 'Non autorizzato a modificare questo annuncio' });
    }
    
    const { titolo, descrizione, prezzo, città, indirizzo, lat, lng, mantieni_immagini } = req.body;
    
    // Gestione immagini
    let immaginiAggiornate = [];
    
    // Se mantieni_immagini è specificato, mantieni quelle esistenti
    if (mantieni_immagini) {
      const immaginiDaMantenere = JSON.parse(mantieni_immagini);
      immaginiAggiornate = immaginiDaMantenere;
    }
    
    // Aggiungi nuove immagini se caricate
    if (req.files && req.files.length > 0) {
      const nuoveImmagini = req.files.map(file => `/uploads/${file.filename}`);
      immaginiAggiornate = [...immaginiAggiornate, ...nuoveImmagini];
    }
    
    // Aggiorna l'annuncio
    await announcement.update({
      titolo: titolo || announcement.titolo,
      descrizione: descrizione || announcement.descrizione,
      prezzo: prezzo ? parseFloat(prezzo) : announcement.prezzo,
      città: città || announcement.città,
      indirizzo: indirizzo || announcement.indirizzo,
      immagini: immaginiAggiornate.length > 0 ? immaginiAggiornate : announcement.immagini,
      lat: lat ? parseFloat(lat) : announcement.lat,
      lng: lng ? parseFloat(lng) : announcement.lng
    });
    
    // Recupera l'annuncio aggiornato con i dati dell'utente
    const updatedAnnouncement = await Announcement.findByPk(announcement.id, {
      include: [{
        model: User,
        attributes: ['id', 'nome', 'cognome', 'username']
      }]
    });
    
    res.json({
      message: 'Annuncio aggiornato con successo',
      announcement: updatedAnnouncement
    });
  } catch (error) {
    console.error('Errore modifica annuncio:', error);
    res.status(500).json({ message: 'Errore durante la modifica dell\'annuncio' });
  }
});

// DELETE - Elimina annuncio (solo proprietario)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Annuncio non trovato' });
    }
    
    // Verifica che l'utente sia il proprietario
    if (announcement.userId != req.userId) {
      return res.status(403).json({ message: 'Non autorizzato a eliminare questo annuncio' });
    }
    
    await announcement.destroy();
    
    res.json({ message: 'Annuncio eliminato con successo' });
  } catch (error) {
    console.error('Errore eliminazione annuncio:', error);
    res.status(500).json({ message: 'Errore durante l\'eliminazione dell\'annuncio' });
  }
});

// GET - Recupera annunci dell'utente loggato
router.get('/user/my-announcements', requireAuth, async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      where: { userId: req.userId },
      include: [{
        model: User,
        attributes: ['id', 'nome', 'cognome', 'username']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(announcements);
  } catch (error) {
    console.error('Errore recupero annunci utente:', error);
    res.status(500).json({ message: 'Errore durante il recupero degli annunci' });
  }
});

module.exports = router;