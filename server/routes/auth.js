const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();

// REGISTRAZIONE
router.post('/register', async (req, res) => {
  try {
    const { username, password, nome, cognome, anno_nascita, telefono } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username già in uso' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password_hash,
      nome,
      cognome,
      anno_nascita,
      telefono
    });

    res.status(201).json({ message: 'Utente registrato', userId: newUser.id });
  } catch (error) {
    console.error('Errore registrazione:', error);
    res.status(500).json({ message: 'Errore durante la registrazione' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ message: 'Credenziali non valide' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Credenziali non valide' });

    res.status(200).json({ message: 'Login riuscito', userId: user.id });
  } catch (error) {
    console.error('Errore login:', error);
    res.status(500).json({ message: 'Errore durante il login' });
  }
});

module.exports = router;
