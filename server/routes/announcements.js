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
    
    if (citta && citta !== '') {      whereClause.citta = {
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
        attributes: ['id', 'nome', 'cognome', 'username', 'telefono', 'email', 'citta', 'provincia', 'professione', 'biografia'] // Non includere password_hash
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
        attributes: ['id', 'nome', 'cognome', 'username', 'telefono', 'email', 'citta', 'provincia', 'professione', 'biografia']
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
    const { titolo, descrizione, prezzo, citta, indirizzo, lat, lng } = req.body;
      // Debug logging ENHANCED
    console.log('🚨 EMERGENCY DEBUG - POST /api/announcements:');
    console.log('👤 User ID from token:', req.userId, '(type:', typeof req.userId, ')');
    console.log('📋 Raw req.body:', JSON.stringify(req.body, null, 2));
    console.log('📎 Files received:', req.files ? req.files.length : 0);
    
    // CHECK IF USER EXISTS
    const userExists = await User.findByPk(req.userId);
    console.log('👤 USER EXISTENCE CHECK:');
    console.log('  - userId from token:', req.userId);
    console.log('  - user exists in DB:', !!userExists);
    console.log('  - user details:', userExists ? {id: userExists.id, email: userExists.email, nome: userExists.nome} : 'NULL');
    
    if (!userExists) {
      console.log('❌ USER NOT FOUND - FOREIGN KEY WILL FAIL!');
      return res.status(401).json({ 
        message: 'Utente non trovato. Effettua nuovamente il login.',
        debug: { 
          userId: req.userId,
          userExists: false
        }
      });
    }
    
    // Field by field analysis
    console.log('🔍 FIELD-BY-FIELD ANALYSIS:');
    console.log(`  🏷️  titolo: "${titolo}" (type: ${typeof titolo}, length: ${titolo?.length || 0})`);
    console.log(`  💰 prezzo: "${prezzo}" (type: ${typeof prezzo}, length: ${prezzo?.length || 0})`);
    console.log(`  🏙️  citta: "${citta}" (type: ${typeof citta}, length: ${citta?.length || 0})`);
    console.log(`  📝 descrizione: "${descrizione}" (type: ${typeof descrizione}, length: ${descrizione?.length || 0})`);
    console.log(`  📍 indirizzo: "${indirizzo}" (type: ${typeof indirizzo}, length: ${indirizzo?.length || 0})`);
    console.log(`  🌐 lat: "${lat}" (type: ${typeof lat})`);
    console.log(`  🌐 lng: "${lng}" (type: ${typeof lng})`);
    
    // Check for undefined/null values
    console.log('🔍 NULL/UNDEFINED CHECK:');
    console.log(`  titolo is falsy: ${!titolo}`);
    console.log(`  prezzo is falsy: ${!prezzo}`);
    console.log(`  citta is falsy: ${!citta}`);
    
    // Validation with detailed logging
    if (!titolo || !prezzo || !citta) {
      console.log('❌ VALIDATION FAILED:');
      console.log('  - titolo empty:', !titolo, `(value: "${titolo}")`);
      console.log('  - prezzo empty:', !prezzo, `(value: "${prezzo}")`);  
      console.log('  - citta empty:', !citta, `(value: "${citta}")`);
      
      return res.status(400).json({ 
        message: 'Titolo, prezzo e città sono obbligatori',
        debug: {
          received: { titolo, prezzo, citta, descrizione, indirizzo },
          validation: {
            titolo: !titolo,
            prezzo: !prezzo,
            citta: !citta
          }
        }
      });
    }
    
    // Processa le immagini caricate
    const immaginiPaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    // SAFE DATA PREPARATION
    const announcementData = {
      titolo: String(titolo || ''),
      descrizione: String(descrizione || ''),
      prezzo: parseFloat(prezzo) || 0,
      citta: String(citta || ''),
      indirizzo: String(indirizzo || ''),
      immagini: immaginiPaths,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      userId: req.userId
    };
    
    console.log('🔧 PREPARED DATA FOR DB:', JSON.stringify(announcementData, null, 2));
    
    // TRY CREATING ANNOUNCEMENT
    console.log('💾 ATTEMPTING TO CREATE ANNOUNCEMENT...');
    const newAnnouncement = await Announcement.create(announcementData);
    console.log('✅ ANNOUNCEMENT CREATED SUCCESSFULLY:', newAnnouncement.id);
    
    // Recupera l'annuncio con i dati dell'utente
    const announcementWithUser = await Announcement.findByPk(newAnnouncement.id, {
      include: [{
        model: User,
        attributes: ['id', 'nome', 'cognome', 'username', 'telefono', 'email', 'citta', 'provincia', 'professione', 'biografia']
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
    if (!titolo || !prezzo || !citta) {
      return res.status(400).json({ 
        message: 'Titolo, prezzo e città sono obbligatori' 
      });
    }
    
    const newAnnouncement = await Announcement.create({
      titolo,
      descrizione,      prezzo: parseFloat(prezzo),
      citta,
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
        attributes: ['id', 'nome', 'cognome', 'username', 'telefono', 'email', 'citta', 'provincia', 'professione', 'biografia']
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
        attributes: ['id', 'nome', 'cognome', 'username', 'telefono', 'email', 'citta', 'provincia', 'professione', 'biografia']
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
        attributes: ['id', 'nome', 'cognome', 'username', 'telefono', 'email', 'citta', 'provincia', 'professione', 'biografia']
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