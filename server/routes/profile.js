const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Announcement = require('../models/announcement');
const { authenticateToken } = require('./auth');
const router = express.Router();

// MIDDLEWARE per verificare autenticazione con JWT
const requireAuth = authenticateToken;

// GET - Recupera profilo utente
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'username', 'nome', 'cognome', 'anno_nascita', 'telefono', 'createdAt']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    // Conta gli annunci dell'utente
    const announcementsCount = await Announcement.count({
      where: { userId: req.userId }
    });
    
    res.json({
      ...user.toJSON(),
      announcementsCount
    });
  } catch (error) {
    console.error('Errore recupero profilo:', error);
    res.status(500).json({ message: 'Errore durante il recupero del profilo' });
  }
});

// PUT - Aggiorna profilo utente
router.put('/', requireAuth, async (req, res) => {
  try {
    const { nome, cognome, anno_nascita, telefono } = req.body;
    
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    // Aggiorna solo i campi forniti
    const updateData = {};
    if (nome !== undefined) updateData.nome = nome;
    if (cognome !== undefined) updateData.cognome = cognome;
    if (anno_nascita !== undefined) updateData.anno_nascita = parseInt(anno_nascita);
    if (telefono !== undefined) updateData.telefono = telefono;
    
    await user.update(updateData);
    
    // Ritorna il profilo aggiornato
    const updatedUser = await User.findByPk(req.userId, {
      attributes: ['id', 'username', 'nome', 'cognome', 'anno_nascita', 'telefono', 'createdAt']
    });
    
    res.json({
      message: 'Profilo aggiornato con successo',
      user: updatedUser
    });
  } catch (error) {
    console.error('Errore aggiornamento profilo:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del profilo' });
  }
});

// PUT - Cambia password
router.put('/password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Password attuale e nuova password sono obbligatorie' 
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'La nuova password deve essere di almeno 6 caratteri' 
      });
    }
    
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    // Verifica password attuale
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Password attuale non corretta' });
    }
    
    // Hash della nuova password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    await user.update({ password_hash: newPasswordHash });
    
    res.json({ message: 'Password cambiata con successo' });
  } catch (error) {
    console.error('Errore cambio password:', error);
    res.status(500).json({ message: 'Errore durante il cambio password' });
  }
});

// GET - Recupera statistiche utente
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Conta annunci totali
    const totalAnnouncements = await Announcement.count({
      where: { userId }
    });
    
    // Conta annunci per città (top 5)
    const announcementsByCity = await Announcement.findAll({
      where: { userId },
      attributes: [
        'città',
        [require('sequelize').fn('COUNT', '*'), 'count']
      ],
      group: ['città'],
      order: [[require('sequelize').literal('count'), 'DESC']],
      limit: 5,
      raw: true
    });
    
    // Prezzo medio degli annunci
    const avgPrice = await Announcement.findOne({
      where: { userId },
      attributes: [
        [require('sequelize').fn('AVG', require('sequelize').col('prezzo')), 'avgPrice']
      ],
      raw: true
    });
    
    res.json({
      totalAnnouncements,
      announcementsByCity,
      avgPrice: avgPrice?.avgPrice ? parseFloat(avgPrice.avgPrice).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Errore recupero statistiche:', error);
    res.status(500).json({ message: 'Errore durante il recupero delle statistiche' });
  }
});

// DELETE - Elimina account (con conferma)
router.delete('/account', requireAuth, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ 
        message: 'Password richiesta per eliminare l\'account' 
      });
    }
    
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    // Verifica password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Password non corretta' });
    }
    
    // Elimina prima tutti gli annunci dell'utente
    await Announcement.destroy({
      where: { userId: req.userId }
    });
    
    // Poi elimina l'utente
    await user.destroy();
    
    res.json({ message: 'Account eliminato con successo' });
  } catch (error) {
    console.error('Errore eliminazione account:', error);
    res.status(500).json({ message: 'Errore durante l\'eliminazione dell\'account' });
  }
});

module.exports = router;