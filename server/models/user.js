const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  nome: DataTypes.STRING,
  cognome: DataTypes.STRING,
  anno_nascita: DataTypes.INTEGER,
  telefono: DataTypes.STRING,
});

module.exports = User;
