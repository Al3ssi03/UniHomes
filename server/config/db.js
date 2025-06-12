const { Sequelize } = require('sequelize');
const path = require('path');

// Carica variabili d'ambiente dal file .env nella directory server
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Usa SQLite per facilità di setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
