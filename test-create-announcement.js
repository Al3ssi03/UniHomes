// Script per creare annunci di test
// Usa la fetch nativa di Node.js (versione 18+)

async function createTestAnnouncement() {
    try {
        // Prima registriamo un utente di test
        console.log('📝 Registrazione utente di test...');
        const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                nome: 'Test',
                cognome: 'User'
            })
        });

        let token;
        if (registerResponse.ok) {
            const registerData = await registerResponse.json();
            token = registerData.token;
            console.log('✅ Utente registrato con successo');
        } else {
            // Se l'utente esiste già, facciamo login
            console.log('👤 Utente esiste già, effettuo login...');
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

            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                token = loginData.token;
                console.log('✅ Login effettuato con successo');
            } else {
                throw new Error('Impossibile effettuare login');
            }
        }

        // Ora creiamo un annuncio di test
        console.log('🏠 Creazione annuncio di test...');
        const announcementResponse = await fetch('http://localhost:5000/api/announcements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                titolo: 'Test Appartamento Roma',
                descrizione: 'Bellissimo appartamento nel centro di Roma, completamente arredato. Vicino all\'università e ai mezzi pubblici.',
                prezzo: 800,
                citta: 'Roma',
                indirizzo: 'Via del Corso, 123',
                lat: 41.9028,
                lng: 12.4964
            })
        });        if (announcementResponse.ok) {
            const announcementData = await announcementResponse.json();
            console.log('✅ Annuncio creato con successo!');
            console.log('📊 Dati risposta:', announcementData);
            console.log(`📋 ID Annuncio: ${announcementData.id || announcementData.announcement?.id}`);
            console.log(`🔗 URL Dettagli: http://localhost:5174/annuncio/${announcementData.id || announcementData.announcement?.id}`);
        } else {
            const error = await announcementResponse.text();
            console.error('❌ Errore nella creazione dell\'annuncio:', error);
        }

    } catch (error) {
        console.error('❌ Errore:', error.message);
    }
}

createTestAnnouncement();
