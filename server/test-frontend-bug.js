const axios = require('axios');

async function testAnnouncementCreation() {
  console.log('🧪 Test Creazione Annuncio Frontend Bug...');
  
  try {
    // Usa un token di test (dovresti sostituire con uno valido)
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFyaW8ucm9zc2kiLCJpYXQiOjE3NDk4MTg3NzUsImV4cCI6MTc0OTgyMjM3NX0.4Vk9PTkEQNLBpOeUCnGlnFJbxjhkXo110sMoUbXsPqQ';
    
    // Simula i dati che il frontend invia
    const formData = new FormData();
    formData.append('titolo', 'Test Annuncio Bug Fix');
    formData.append('descrizione', 'Test per verificare il bug della città');
    formData.append('prezzo', '650');
    formData.append('citta', 'Roma');  // Nota: usando 'citta' non 'città'
    formData.append('indirizzo', 'Via del Test 123');
    
    console.log('📋 Dati da inviare:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    const response = await axios.post('http://localhost:5000/api/announcements', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('✅ Successo!');
    console.log('📊 Status:', response.status);
    console.log('📋 Dati ricevuti:', response.data);
    
  } catch (error) {
    console.log('❌ Errore:', error.response?.status);
    console.log('📋 Messaggio:', error.response?.data?.message);
    console.log('📋 Dettagli completi:', error.response?.data);
  }
}

testAnnouncementCreation();
