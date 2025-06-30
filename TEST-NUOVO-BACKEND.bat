@echo off
echo === TEST NUOVO BACKEND CON INFORMAZIONI PROPRIETARIO ===
echo.

cd server

echo 🔧 Sincronizzazione database per aggiornare modello User...
node -e "
const sequelize = require('./config/db');
const User = require('./models/user');

async function syncDb() {
  try {
    console.log('🔄 Sincronizzazione database...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database sincronizzato con successo!');
    console.log('🆕 Nuovi campi User: citta, provincia, professione, biografia');
    process.exit(0);
  } catch (error) {
    console.error('❌ Errore sincronizzazione:', error);
    process.exit(1);
  }
}

syncDb();
"

echo.
echo 🚀 Avvio server con nuove funzionalità...
npm start

pause
