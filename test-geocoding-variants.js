// Test geocoding con varianti
async function testGeocodeVariants() {
    console.log('🔍 Test geocoding con varianti...');
    
    const addresses = [
        // Base
        'Oria, Brindisi, Italia',
        
        // Varianti via
        'Via Brunelleschi, Oria, Brindisi, Italia',
        'Brunelleschi, Oria, Brindisi, Italia',
        'Via F. Brunelleschi, Oria, Brindisi, Italia',
        'Filippo Brunelleschi, Oria, Brindisi, Italia',
        
        // Varianti generiche
        'Centro storico, Oria, Brindisi, Italia',
        'Piazza del Popolo, Oria, Brindisi, Italia',
        
        // Varianti con codice postale
        'Via Filippo Brunelleschi, 72024 Oria, Italia',
        'Via Brunelleschi, 72024 Oria, Italia'
    ];
    
    for (let address of addresses) {
        console.log(`\n📍 Test per: "${address}"`);
        
        try {
            const encodedAddress = encodeURIComponent(address);
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`);
            const data = await response.json();
            
            if (data && data.length > 0) {
                const result = data[0];
                console.log(`✅ Trovato: [${result.lat}, ${result.lon}]`);
                console.log(`📝 Nome: ${result.display_name}`);
                
                // Calcola distanza dal centro di Oria
                const oriaLat = 40.4973270;
                const oriaLng = 17.6413100;
                const distance = Math.sqrt(
                    Math.pow(parseFloat(result.lat) - oriaLat, 2) + 
                    Math.pow(parseFloat(result.lon) - oriaLng, 2)
                ) * 111; // Approssimazione in km
                console.log(`📏 Distanza dal centro: ${distance.toFixed(2)} km`);
            } else {
                console.log(`❌ Nessun risultato`);
            }
        } catch (error) {
            console.log(`❌ Errore: ${error.message}`);
        }
        
        // Pausa tra le richieste
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n✅ Test completato!');
}

// Esegui il test
testGeocodeVariants();
