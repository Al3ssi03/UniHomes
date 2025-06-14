const fetch = require('node-fetch');
const FormData = require('form-data');

async function testAnnouncementAPI() {
  try {
    console.log('🧪 Test API Creazione Annuncio...');
    
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFyaW8ucm9zc2kiLCJpYXQiOjE3NDk4MTg3NzUsImV4cCI6MTc0OTgyMjM3NX0.4Vk9PTkEQNLBpOeUCnGlnFJbxjhkXo110sMoUbXsPqQ';
    
    const form = new FormData();
    form.append('titolo', 'Test API Completo');
    form.append('descrizione', 'Test completo API endpoint');
    form.append('prezzo', '850');
    form.append('città', 'Roma API Test');
    form.append('indirizzo', 'Via API Test 789');
    
    console.log('📝 Invio richiesta POST...');
    
    const response = await fetch('http://localhost:5000/api/announcements', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: form
    });
    
    console.log('📊 Status Response:', response.status);
    console.log('📊 Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('📋 Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Annuncio creato con successo via API!');
    } else {
      console.log('❌ Errore nella creazione annuncio via API');
    }
    
  } catch (error) {
    console.error('❌ Errore di connessione:', error.message);
  }
}

testAnnouncementAPI();
