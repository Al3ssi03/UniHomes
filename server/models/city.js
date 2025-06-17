const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const City = sequelize.define('City', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  provincia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  regione: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = City;
