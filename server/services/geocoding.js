const axios = require('axios');

// Configurazione base per Nominatim
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'UniHomes_App/1.0'; // È buona pratica identificare la tua app

// Aggiunge un delay tra le richieste per rispettare i limiti di Nominatim
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Cerca indirizzi in una città
async function searchAddresses(query, city, limit = 5) {
    try {
        await delay(1000); // Delay di 1 secondo tra le richieste
        const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
            params: {
                q: `${query}, ${city}, Italia`,
                format: 'json',
                limit: limit,
                addressdetails: 1,
                countrycodes: 'it'
            },
            headers: {
                'User-Agent': USER_AGENT
            }
        });

        // Formatta i risultati per l'uso nell'app
        return response.data.map(result => ({
            display_name: result.display_name,
            address: {
                road: result.address.road || result.address.pedestrian || '',
                house_number: result.address.house_number || '',
                postcode: result.address.postcode || '',
                city: result.address.city || result.address.town || result.address.village || '',
            },
            lat: result.lat,
            lon: result.lon
        }));
    } catch (error) {
        console.error('Errore nella ricerca degli indirizzi:', error);
        throw error;
    }
}

// Ottiene le coordinate di un indirizzo
async function getCoordinates(address, city) {
    try {
        await delay(1000);
        const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
            params: {
                q: `${address}, ${city}, Italia`,
                format: 'json',
                limit: 1
            },
            headers: {
                'User-Agent': USER_AGENT
            }
        });

        if (response.data.length > 0) {
            return {
                lat: response.data[0].lat,
                lon: response.data[0].lon
            };
        }
        return null;
    } catch (error) {
        console.error('Errore nel recupero delle coordinate:', error);
        throw error;
    }
}

module.exports = {
    searchAddresses,
    getCoordinates
};
