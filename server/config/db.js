const { Sequelize } = require('sequelize');
require('dotenv').config({ path: 'C:\Users\HP 15-FA0005NL\Desktop\UniHomes\server\.env' }); // o './.env' se metti il .env in /server






 const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  String(process.env.DB_PASSWORD),  // ← Forzatura importante
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: Number(process.env.DB_PORT), // ← Anche il numero, per sicurezza
    logging: false,
  }
); 

module.exports = sequelize;
