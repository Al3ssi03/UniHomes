require('dotenv').config(); 
const sequelize = require('./config/db');
const User = require('./models/user');
const Announcement = require('./models/announcement');

(async () => {
  try {
    await sequelize.sync({ force: true }); // Ricrea tabelle
    console.log('✅ Database sincronizzato correttamente!');
  } catch (err) {
    console.error('❌ Errore nella sincronizzazione:', err);
  } finally {
    await sequelize.close();
  }
})();
