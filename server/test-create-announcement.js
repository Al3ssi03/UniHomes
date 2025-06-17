const axios = require('axios');

async function testCreateAnnouncement() {
  try {
    console.log('🧪 Test Creazione Annuncio - Step by Step\n');
    
    // Step 1: Login per ottenere il token
    console.log('1️⃣ Effettuo login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'mario.rossi',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login effettuato, token ottenuto');
    
    // Step 2: Test API città
    console.log('\n2️⃣ Test API città...');
    const citiesResponse = await axios.get('http://localhost:5000/api/cities?q=Milano');
    console.log('✅ Città trovate:', citiesResponse.data.length);
    
    // Step 3: Test API geocoding
    console.log('\n3️⃣ Test API geocoding...');
    const geocodingResponse = await axios.get('http://localhost:5000/api/geocoding/search', {
      params: {
        query: 'Via Bocconi',
        city: 'Milano'
      }
    });
    console.log('✅ Indirizzi trovati:', geocodingResponse.data.length);
    
    // Step 4: Creazione annuncio
    console.log('\n4️⃣ Creazione annuncio...');
    const formData = new FormData();
    formData.append('titolo', 'Test Annuncio Completo');
    formData.append('descrizione', 'Descrizione test per verifica funzionalità');
    formData.append('prezzo', '750');
    formData.append('citta', 'Milano');  // Usando 'citta' senza accento
    formData.append('indirizzo', 'Via Bocconi, 8');
    formData.append('lat', '45.4654');
    formData.append('lng', '9.1859');
    
    const createResponse = await axios.post('http://localhost:5000/api/announcements', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('✅ Annuncio creato con successo!');
    console.log('📋 Dettagli annuncio:', {
      id: createResponse.data.announcement.id,
      titolo: createResponse.data.announcement.titolo,
      citta: createResponse.data.announcement.citta,
      prezzo: createResponse.data.announcement.prezzo
    });
    
    // Step 5: Verifica che l'annuncio sia visibile
    console.log('\n5️⃣ Verifica annuncio nella lista...');
    const listResponse = await axios.get('http://localhost:5000/api/announcements');
    
    const createdAnnouncement = listResponse.data.announcements.find(
      ann => ann.id === createResponse.data.announcement.id
    );
    
    if (createdAnnouncement) {
      console.log('✅ Annuncio trovato nella lista pubblica');
      console.log('📍 Città nella lista:', createdAnnouncement.citta);
    } else {
      console.log('❌ Annuncio non trovato nella lista');
    }
    
    console.log('\n🎉 Test completato con successo!');
    
  } catch (error) {
    console.error('❌ Errore durante il test:', error.response?.data || error.message);
  }
}

testCreateAnnouncement();
