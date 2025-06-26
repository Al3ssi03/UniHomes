const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const createOriaAnnouncement = async () => {
  try {
    console.log('👤 Login utente di test...');
    
    // Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'testuser',
      password: 'password123'
    });
      if (loginResponse.data.success || loginResponse.data.token) {
      console.log('✅ Login effettuato con successo');
      const token = loginResponse.data.token;
      
      // Crea annuncio per Oria
      console.log('🏠 Creazione annuncio per Oria...');
      
      const announcementData = {
        titolo: '🏡 Casa Via Brunelleschi Oria',
        descrizione: 'Bellissima casa studentesca nel centro storico di Oria. Situata in Via Filippo Brunelleschi, a pochi minuti dalle principali università del Salento. Casa completamente arredata con tutti i comfort.',
        prezzo: 450,
        citta: 'Oria',
        provincia: 'BR',
        indirizzo: 'Via Filippo Brunelleschi, 31a',
        immagini: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
        ]
      };
      
      const response = await axios.post(`${BASE_URL}/announcements`, announcementData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });      
      if (response.data.success || response.data.announcement) {
        console.log(`✅ Annuncio creato con ID: ${response.data.announcement.id}`);
        console.log(`🔗 URL dettaglio: http://localhost:5173/annuncio/${response.data.announcement.id}`);
        console.log(`📍 Indirizzo: ${response.data.announcement.indirizzo}, ${response.data.announcement.citta}, ${response.data.announcement.provincia}`);
      } else {
        console.error('❌ Errore nella creazione dell\'annuncio:', response.data);
      }
    } else {
      console.error('❌ Errore nel login:', loginResponse.data.message);
    }
  } catch (error) {
    console.error('❌ Errore:', error.response?.data || error.message);
  }
};

createOriaAnnouncement();
