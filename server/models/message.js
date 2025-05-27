const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Message = sequelize.define('Message', {
  contenuto: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  letto: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Relazioni
User.hasMany(Message, { 
  foreignKey: 'senderId', 
  as: 'SentMessages' 
});

User.hasMany(Message, { 
  foreignKey: 'receiverId', 
  as: 'ReceivedMessages' 
});

Message.belongsTo(User, { 
  foreignKey: 'senderId', 
  as: 'Sender' 
});

Message.belongsTo(User, { 
  foreignKey: 'receiverId', 
  as: 'Receiver' 
});

module.exports = Message;