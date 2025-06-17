const express = require('express');
const City = require('../models/city');
const { Op } = require('sequelize');
const router = express.Router();

// GET - Ottieni tutte le città
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    let whereClause = {};
    
    if (q) {
      whereClause = {
        nome: {
          [Op.like]: `%${q}%`
        }
      };
    }
    
    const cities = await City.findAll({
      where: whereClause,
      order: [['nome', 'ASC']],
      limit: 20
    });
    
    res.json(cities);
  } catch (error) {
    console.error('Errore nel recupero delle città:', error);
    res.status(500).json({ message: 'Errore nel recupero delle città' });
  }
});

// POST - Aggiungi una nuova città (protetto, solo per admin)
router.post('/', async (req, res) => {
  try {
    const { nome, provincia, regione } = req.body;
    
    if (!nome || !provincia || !regione) {
      return res.status(400).json({ message: 'Nome, provincia e regione sono richiesti' });
    }
    
    const city = await City.create({
      nome,
      provincia,
      regione
    });
    
    res.status(201).json(city);
  } catch (error) {
    console.error('Errore nella creazione della città:', error);
    res.status(500).json({ message: 'Errore nella creazione della città' });
  }
});

module.exports = router;
