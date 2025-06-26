// Test diretto geocoding
async function testDirectGeocode() {
    console.log('🔍 Test diretto geocoding...');
    
    const addresses = [
        'Oria, BR, Italia',
        'Via Filippo Brunelleschi, Oria, BR, Italia',
        'Via Filippo Brunelleschi, 31a, Oria, BR, Italia',
        'Via Filippo Brunelleschi, 31a, Oria, Brindisi, Italia'
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
testDirectGeocode();
