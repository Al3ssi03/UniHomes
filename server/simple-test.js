const fetch = require('node-fetch');

async function simpleTest() {
  try {
    console.log('🧪 Test semplice connessione server...');
    
    const response = await fetch('http://localhost:5000/api/test');
    const data = await response.json();
    
    console.log('✅ Server risponde:', data);
    
  } catch (error) {
    console.error('❌ Errore:', error.message);
  }
}

simpleTest();
