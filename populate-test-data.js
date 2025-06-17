// Script per popolare il database con annunci di test variati
async function createMultipleTestAnnouncements() {
    try {
        // Login con l'utente di test
        console.log('👤 Login utente di test...');
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'testuser',
                password: 'password123'
            })
        });

        if (!loginResponse.ok) {
            throw new Error('Login fallito');
        }

        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log('✅ Login effettuato con successo');

        // Annunci di test variati
        const testAnnouncements = [
            {
                titolo: '🏠 Appartamento Centro Storico Roma',
                descrizione: 'Splendido bilocale nel cuore di Roma, a due passi da Piazza Navona. Completamente ristrutturato, arredato con gusto. Ideale per studenti universitari.',
                prezzo: 1200,
                citta: 'Roma',
                indirizzo: 'Via del Corso, 150',
                lat: 41.9028,
                lng: 12.4964
            },
            {
                titolo: '🏢 Monolocale Moderno Milano',
                descrizione: 'Monolocale di design nella zona Brera, perfetto per giovani professionisti. Zona tranquilla ma vicina ai mezzi pubblici e alle università.',
                prezzo: 900,
                citta: 'Milano',
                indirizzo: 'Via Brera, 45',
                lat: 45.4642,
                lng: 9.1900
            },
            {
                titolo: '🌟 Casa Studentesca Napoli',
                descrizione: 'Accogliente appartamento condiviso nel quartiere universitario. Stanze singole disponibili, cucina e bagno in comune. Ambiente giovane e dinamico.',
                prezzo: 450,
                citta: 'Napoli',
                indirizzo: 'Via Mezzocannone, 78',
                lat: 40.8518,
                lng: 14.2681
            },
            {
                titolo: '🏛️ Stanza in Villa Firenze',
                descrizione: 'Stanza singola in villa signorile nella zona di Oltrarno. Vista panoramica, giardino privato. Perfetta per studenti delle Belle Arti.',
                prezzo: 650,
                citta: 'Firenze',
                indirizzo: 'Via Santo Spirito, 28',
                lat: 43.7696,
                lng: 11.2558
            },
            {
                titolo: '🎓 Posto Letto Bologna',
                descrizione: 'Posto letto in camera doppia, vicino all\'Università di Bologna. Casa con studenti internazionali, ambiente multiculturale e stimolante.',
                prezzo: 380,
                citta: 'Bologna',
                indirizzo: 'Via Zamboni, 12',
                lat: 44.4949,
                lng: 11.3426
            }
        ];

        console.log(`🏠 Creazione di ${testAnnouncements.length} annunci di test...`);

        for (let i = 0; i < testAnnouncements.length; i++) {
            const announcement = testAnnouncements[i];
            console.log(`📝 Creazione annuncio ${i + 1}: ${announcement.titolo}`);

            const response = await fetch('http://localhost:5000/api/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(announcement)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Annuncio creato con ID: ${data.announcement.id}`);
            } else {
                const error = await response.text();
                console.error(`❌ Errore creazione annuncio ${i + 1}:`, error);
            }

            // Piccola pausa tra le creazioni
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('\n🎉 CREAZIONE ANNUNCI COMPLETATA!');
        console.log('🔗 Test URLs:');
        console.log('   📋 Lista: http://localhost:5174/listings');
        console.log('   🏠 Dettagli: http://localhost:5174/annuncio/1');
        console.log('   📝 Pubblicazione: http://localhost:5174/publish');

    } catch (error) {
        console.error('❌ Errore:', error.message);
    }
}

createMultipleTestAnnouncements();
