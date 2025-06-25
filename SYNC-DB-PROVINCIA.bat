@echo off
echo === SINCRONIZZAZIONE DATABASE CON PROVINCIA ===
echo.

cd server

echo 🔧 Sincronizzazione database per aggiungere campo provincia agli annunci...
node -e "
const sequelize = require('./config/db');
const Announcement = require('./models/announcement');

async function syncDb() {
  try {
    console.log('🔄 Sincronizzazione database...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database sincronizzato con successo!');
    console.log('🆕 Campo provincia aggiunto alla tabella Announcements');
    console.log('📋 Schema aggiornato: titolo, descrizione, prezzo, citta, provincia, indirizzo, immagini, lat, lng');
    process.exit(0);
  } catch (error) {
    console.error('❌ Errore sincronizzazione:', error);
    process.exit(1);
  }
}

syncDb();
"

echo.
echo ✅ Database pronto per gli annunci con provincia!
pause
