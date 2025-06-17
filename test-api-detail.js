// Test API dettaglio annuncio
async function testAnnouncementDetail() {
    try {
        console.log('🔍 Test API dettaglio annuncio...');
        
        // Test endpoint dettaglio
        const response = await fetch('http://localhost:5000/api/announcements/2');
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API dettaglio funzionante!');
            console.log('📊 Dati annuncio:', JSON.stringify(data, null, 2));
        } else {
            console.error('❌ Errore API dettaglio:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('📄 Dettagli errore:', errorText);
        }
        
        // Test endpoint lista annunci
        console.log('\n📋 Test API lista annunci...');
        const listResponse = await fetch('http://localhost:5000/api/announcements');
          if (listResponse.ok) {
            const listData = await listResponse.json();
            console.log('✅ API lista funzionante!');
            console.log('📊 Struttura risposta lista:', typeof listData);
            console.log('📊 Dati lista completi:', JSON.stringify(listData, null, 2));
            
            const announcements = listData.announcements || listData;
            console.log(`📊 Numero annunci: ${announcements?.length || 'N/A'}`);
            if (announcements && announcements.length > 0) {
                console.log('🏠 Primo annuncio:', {
                    id: announcements[0].id,
                    titolo: announcements[0].titolo,
                    citta: announcements[0].citta,
                    prezzo: announcements[0].prezzo
                });
            }
        } else {
            console.error('❌ Errore API lista:', listResponse.status, listResponse.statusText);
        }
        
    } catch (error) {
        console.error('❌ Errore di connessione:', error.message);
    }
}

testAnnouncementDetail();
