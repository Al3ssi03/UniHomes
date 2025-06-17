// Test per simulare il comportamento del frontend

async function testWithFetch() {
  console.log('🧪 Test con Fetch (simula browser)...');
  
  try {
    // Prima ottieni un token valido
    console.log('1️⃣ Provo login...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'mario.rossi',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginResponse.status);
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful!');
    const token = loginData.token;
    
    // Ora crea un annuncio
    console.log('2️⃣ Creo annuncio...');
    const formData = new FormData();
    formData.append('titolo', 'Test Annuncio Frontend Bug');
    formData.append('descrizione', 'Test per verificare il bug della città');
    formData.append('prezzo', '650');
    formData.append('citta', 'Roma');  // Usando 'citta' non 'città'
    formData.append('indirizzo', 'Via del Test 123');
    
    console.log('📋 Dati da inviare:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    const response = await fetch('http://localhost:5000/api/announcements', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    console.log('📊 Status:', response.status);
    const data = await response.json();
    console.log('📋 Response:', data);
    
    if (response.ok) {
      console.log('✅ Annuncio creato con successo!');
    } else {
      console.log('❌ Errore nella creazione:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Errore:', error);
  }
}

// Usa node-fetch per simulare fetch nel browser
const fetch = require('node-fetch');
const FormData = require('form-data');

testWithFetch();
