const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// REGISTRAZIONE
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, nome, cognome, anno_nascita, telefono, confirmPassword } = req.body;

    // Validazione base
    if (!password || password !== confirmPassword) {
      return res.status(400).json({ message: 'Le password non coincidono' });
    }

    if (!username && !email) {
      return res.status(400).json({ message: 'Username o email richiesti' });
    }

    // Controlla se username o email già esistono
    const existingUser = await User.findOne({ 
      where: {
        ...(username && { username }),
        ...(email && { email })
      }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username o email già in uso' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username || email,
      email: email || null,
      password_hash,
      nome,
      cognome,
      anno_nascita,
      telefono
    });

    // Genera token JWT
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'Utente registrato', 
      userId: newUser.id,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        nome: newUser.nome,
        cognome: newUser.cognome
      }
    });
  } catch (error) {
    console.error('Errore registrazione:', error);
    res.status(500).json({ message: 'Errore durante la registrazione' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const loginField = email || username;

    if (!loginField) {
      return res.status(400).json({ message: 'Email o username richiesti' });
    }    // Cerca per email o username
    const user = await User.findOne({ 
      where: {
        [require('sequelize').Op.or]: [
          { email: loginField },
          { username: loginField }
        ]
      }
    });
    
    if (!user) return res.status(401).json({ message: 'Credenziali non valide' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Credenziali non valide' });

    // Genera token JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      message: 'Login riuscito', 
      userId: user.id,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nome: user.nome,
        cognome: user.cognome
      }
    });
  } catch (error) {
    console.error('Errore login:', error);
    res.status(500).json({ message: 'Errore durante il login' });
  }
});

// Middleware per verificare JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token di accesso richiesto' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token non valido' });
    }
    req.userId = user.userId;
    req.username = user.username;
    next();
  });
};

module.exports = { router, authenticateToken };
