const sequelize = require('./config/db');
const City = require('./models/city');

const cities = [
  { nome: 'Milano', provincia: 'MI', regione: 'Lombardia' },
  { nome: 'Roma', provincia: 'RM', regione: 'Lazio' },
  { nome: 'Napoli', provincia: 'NA', regione: 'Campania' },
  { nome: 'Torino', provincia: 'TO', regione: 'Piemonte' },
  { nome: 'Bologna', provincia: 'BO', regione: 'Emilia-Romagna' },
  { nome: 'Firenze', provincia: 'FI', regione: 'Toscana' },
  { nome: 'Bari', provincia: 'BA', regione: 'Puglia' },
  { nome: 'Padova', provincia: 'PD', regione: 'Veneto' },
  { nome: 'Pisa', provincia: 'PI', regione: 'Toscana' },
  { nome: 'Palermo', provincia: 'PA', regione: 'Sicilia' },
  { nome: 'Catania', provincia: 'CT', regione: 'Sicilia' },
  { nome: 'Venezia', provincia: 'VE', regione: 'Veneto' },
  { nome: 'Verona', provincia: 'VR', regione: 'Veneto' },
  { nome: 'Trento', provincia: 'TN', regione: 'Trentino-Alto Adige' },
  { nome: 'Trieste', provincia: 'TS', regione: 'Friuli-Venezia Giulia' },
  { nome: 'Genova', provincia: 'GE', regione: 'Liguria' },
  { nome: 'Cagliari', provincia: 'CA', regione: 'Sardegna' }
];

async function seedCities() {
  try {
    await sequelize.sync();
    
    // Delete existing cities
    await City.destroy({ where: {} });
    
    // Insert new cities
    await City.bulkCreate(cities);
    
    console.log('✅ Database popolato con le città');
    process.exit(0);
  } catch (error) {
    console.error('❌ Errore durante il popolamento del database:', error);
    process.exit(1);
  }
}

seedCities();
