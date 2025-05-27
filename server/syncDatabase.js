const sequelize = require('./config/db');
const User = require('./models/user');
const Announcement = require('./models/announcement');
const Message = require('./models/message');

async function syncDatabase() {
  try {
    console.log('🔄 Connessione al database in corso...');
    
    // Test della connessione
    await sequelize.authenticate();
    console.log('✅ Connessione al database stabilita con successo.');
    
    // Sincronizzazione dei modelli
    console.log('🔄 Sincronizzazione modelli in corso...');
    
    // Sincronizza in ordine di dipendenza
    await User.sync({ alter: true });
    console.log('✅ Tabella User sincronizzata');
    
    await Announcement.sync({ alter: true });
    console.log('✅ Tabella Announcement sincronizzata');
    
    await Message.sync({ alter: true });
    console.log('✅ Tabella Message sincronizzata');
    
    console.log('🎉 Database sincronizzato con successo!');
    
    // Mostra un riepilogo delle tabelle
    console.log('\n📊 Riepilogo tabelle create:');
    console.log('- users: Gestione utenti registrati');
    console.log('- announcements: Gestione annunci immobiliari');
    console.log('- messages: Sistema di messaggistica');
    
  } catch (error) {
    console.error('❌ Errore durante la sincronizzazione del database:', error);
    process.exit(1);
  }
}

// Funzione per creare alcuni dati di esempio (opzionale)
async function createSampleData() {
  try {
    console.log('\n🔄 Creazione dati di esempio...');
    
    // Verifica se esistono già utenti
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('ℹ️  Dati di esempio già presenti, saltando...');
      return;
    }
    
    const bcrypt = require('bcrypt');
    
    // Crea utenti di esempio
    const user1 = await User.create({
      username: 'mario.rossi',
      password_hash: await bcrypt.hash('password123', 10),
      nome: 'Mario',
      cognome: 'Rossi',
      anno_nascita: 1995,
      telefono: '3331234567'
    });
    
    const user2 = await User.create({
      username: 'giulia.bianchi',
      password_hash: await bcrypt.hash('password123', 10),
      nome: 'Giulia',
      cognome: 'Bianchi',
      anno_nascita: 1997,
      telefono: '3339876543'
    });
    
    // Crea annunci di esempio
    await Announcement.create({
      titolo: 'Stanza singola in centro',
      descrizione: 'Bella stanza singola in appartamento condiviso, zona universitaria, ben collegata con i mezzi pubblici.',
      prezzo: 450.00,
      città: 'Bologna',
      indirizzo: 'Via del Pratello, 15',
      immagini: ['/uploads/sample1.jpg'],
      lat: 44.4949,
      lng: 11.3426,
      userId: user1.id
    });
    
    await Announcement.create({
      titolo: 'Appartamento monolocale',
      descrizione: 'Monolocale arredato, ideale per studente o lavoratore. Cucina attrezzata, bagno privato.',
      prezzo: 650.00,
      città: 'Milano',
      indirizzo: 'Via Bocconi, 8',
      immagini: ['/uploads/sample2.jpg'],
      lat: 45.4654,
      lng: 9.1859,
      userId: user2.id
    });
    
    await Announcement.create({
      titolo: 'Posto letto in doppia',
      descrizione: 'Posto letto in camera doppia, ideale per studenti. Ambiente giovane e dinamico.',
      prezzo: 280.00,
      città: 'Bologna',
      indirizzo: 'Via Zamboni, 33',
      immagini: ['/uploads/sample3.jpg'],
      lat: 44.4963,
      lng: 11.3515,
      userId: user1.id
    });
    
    console.log('✅ Dati di esempio creati con successo!');
    console.log('\n📝 Credenziali di accesso di esempio:');
    console.log('Username: mario.rossi | Password: password123');
    console.log('Username: giulia.bianchi | Password: password123');
    
  } catch (error) {
    console.error('❌ Errore durante la creazione dei dati di esempio:', error);
  }
}

// Funzione principale
async function initializeDatabase(createSamples = false) {
  await syncDatabase();
  
  if (createSamples) {
    await createSampleData();
  }
  
  await sequelize.close();
  console.log('\n🔌 Connessione database chiusa.');
}

// Esegui se chiamato direttamente
if (require.main === module) {
  const createSamples = process.argv.includes('--samples');
  initializeDatabase(createSamples);
}

module.exports = { initializeDatabase, syncDatabase };