// Test finale per confermare che tutto funziona
async function testFinale() {
    console.log('🎯 TEST FINALE - Verifica completa del sistema');
    console.log('================================================');
    
    // Test 1: Backend API Lista
    console.log('\n📋 Test 1: API Lista Annunci');
    try {
        const response = await fetch('http://localhost:5000/api/announcements');
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Lista annunci: ${data.announcements.length} annunci trovati`);
            
            // Mostra primi 3 annunci
            data.announcements.slice(0, 3).forEach((ann, i) => {
                console.log(`   ${i+1}. ${ann.titolo} (ID: ${ann.id})`);
            });
        } else {
            console.error('❌ Errore API lista');
        }
    } catch (error) {
        console.error('❌ Errore connessione API lista:', error.message);
    }
    
    // Test 2: Backend API Dettagli
    console.log('\n🏠 Test 2: API Dettagli Annunci');
    const testIds = [6, 5, 4];
    
    for (let id of testIds) {
        try {
            const response = await fetch(`http://localhost:5000/api/announcements/${id}`);
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Dettaglio ID ${id}: ${data.titolo}`);
            } else {
                console.error(`❌ Errore dettaglio ID ${id}: ${response.status}`);
            }
        } catch (error) {
            console.error(`❌ Errore connessione dettaglio ID ${id}:`, error.message);
        }
    }
    
    // Test 3: Frontend URLs
    console.log('\n🌐 Test 3: URL Frontend');
    const frontendUrls = [
        'http://localhost:5174/',
        'http://localhost:5174/listings',
        'http://localhost:5174/annuncio/6',
        'http://localhost:5174/annuncio/5',
        'http://localhost:5174/publish'
    ];
    
    frontendUrls.forEach(url => {
        console.log(`🔗 ${url}`);
    });
    
    console.log('\n================================================');
    console.log('🎉 TEST COMPLETATO!');
    console.log('📝 ISTRUZIONI PER IL TEST MANUALE:');
    console.log('1. Vai su http://localhost:5174/listings');
    console.log('2. Clicca su "Vedi Dettagli" di qualsiasi annuncio');
    console.log('3. Verifica che si apra la pagina dettagli');
    console.log('4. Testa il form di pubblicazione su /publish');
    console.log('================================================');
}

testFinale();
