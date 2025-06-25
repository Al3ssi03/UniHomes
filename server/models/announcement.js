const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Announcement = sequelize.define('Announcement', {
  titolo: { type: DataTypes.STRING, allowNull: false },
  descrizione: DataTypes.TEXT,  prezzo: { type: DataTypes.DECIMAL, allowNull: false },
  citta: DataTypes.STRING,
  provincia: DataTypes.STRING,
  indirizzo: DataTypes.STRING,
  immagini: DataTypes.JSON, // Array di URL (una o più immagini)
  lat: DataTypes.FLOAT,
  lng: DataTypes.FLOAT,
}, {
  timestamps: true
});

User.hasMany(Announcement, { foreignKey: 'userId' });
Announcement.belongsTo(User, { foreignKey: 'userId' });

module.exports = Announcement;
