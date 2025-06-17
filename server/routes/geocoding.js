const express = require('express');
const router = express.Router();
const { searchAddresses, getCoordinates } = require('../services/geocoding');

// GET - Cerca indirizzi in una città
router.get('/search', async (req, res) => {
    try {
        const { query, city } = req.query;
        
        if (!query || !city) {
            return res.status(400).json({ 
                message: 'Query e città sono richieste' 
            });
        }

        const addresses = await searchAddresses(query, city);
        res.json(addresses);
    } catch (error) {
        console.error('Errore nella ricerca degli indirizzi:', error);
        res.status(500).json({ 
            message: 'Errore durante la ricerca degli indirizzi' 
        });
    }
});

// GET - Ottieni coordinate di un indirizzo
router.get('/coordinates', async (req, res) => {
    try {
        const { address, city } = req.query;
        
        if (!address || !city) {
            return res.status(400).json({ 
                message: 'Indirizzo e città sono richiesti' 
            });
        }

        const coordinates = await getCoordinates(address, city);
        
        if (!coordinates) {
            return res.status(404).json({ 
                message: 'Coordinate non trovate per questo indirizzo' 
            });
        }

        res.json(coordinates);
    } catch (error) {
        console.error('Errore nel recupero delle coordinate:', error);
        res.status(500).json({ 
            message: 'Errore durante il recupero delle coordinate' 
        });
    }
});

module.exports = router;
