const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

// Importa configurazione database
const sequelize = require('./config/db');

// Importa modelli per assicurarsi che le relazioni siano definite
require('./models/user');
require('./models/announcement');
require('./models/message');

// Importa routes
const { router: authRoutes } = require('./routes/auth');
const announcementsRoutes = require('./routes/announcements');
const profileRoutes = require('./routes/profile');
const messagesRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 5000;

// Configurazione upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo immagini sono consentite'));
    }
  }
});

// Crea cartella uploads se non esiste
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servire file statici (immagini upload)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware per logging delle richieste (opzionale)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/messages', messagesRoutes);

// Route di test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server FuoriSede/UniHomes funzionante!' });
});

// Route per recuperare info server
app.get('/api/info', async (req, res) => {
  try {
    const User = require('./models/user');
    const Announcement = require('./models/announcement');
    const Message = require('./models/message');
    
    const usersCount = await User.count();
    const announcementsCount = await Announcement.count();
    const messagesCount = await Message.count();
    
    res.json({
      appName: 'FuoriSede/UniHomes',
      version: '1.0.0',
      status: 'online',
      database: 'connected',
      stats: {
        users: usersCount,
        announcements: announcementsCount,
        messages: messagesCount
      },
      endpoints: {
        auth: '/api/auth',
        announcements: '/api/announcements',
        profile: '/api/profile',
        messages: '/api/messages'
      }
    });
  } catch (error) {    res.status(500).json({
      appName: 'UNI Home',
      status: 'error',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Middleware per gestire 404
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Endpoint non trovato',
    availableEndpoints: [
      'GET /api/test',
      'GET /api/info',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/announcements',
      'POST /api/announcements',
      'GET /api/profile',
      'GET /api/messages/conversations'
    ]
  });
});

// Middleware per gestire errori
app.use((error, req, res, next) => {
  console.error('Errore server:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Errore di validazione',
      errors: error.errors
    });
  }
  
  if (error.name === 'MulterError') {
    return res.status(400).json({
      message: 'Errore upload file',
      error: error.message
    });
  }
  
  res.status(500).json({
    message: 'Errore interno del server',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

// Funzione per avviare il server
async function startServer() {
  try {
    // Test connessione database
    await sequelize.authenticate();
    console.log('✅ Connessione database stabilita');
    
    // Sincronizza modelli (solo in sviluppo)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelli database sincronizzati');
    }
      // Avvia server
    app.listen(PORT, () => {
      console.log('\n🏠 UNI Home Server avviato con successo!');
      console.log(`📡 Server in ascolto su porta ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`📋 Info API: http://localhost:${PORT}/api/info`);
      console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
      console.log('\n📚 Endpoints disponibili:');
      console.log('   Auth: /api/auth/[register|login]');
      console.log('   Annunci: /api/announcements');
      console.log('   Profilo: /api/profile');
      console.log('   Messaggi: /api/messages');
      console.log('\n✨ UNI Home Server pronto per le richieste!');
    });
    
  } catch (error) {
    console.error('❌ Errore avvio server:', error);
    process.exit(1);
  }
}

// Gestione graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\n🔄 Shutdown del server in corso...');
  await sequelize.close();
  console.log('✅ Connessioni database chiuse');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n🔄 Shutdown del server in corso...');
  await sequelize.close();
  console.log('✅ Connessioni database chiuse');
  process.exit(0);
});

// Avvia il server
if (require.main === module) {
  startServer();
}

module.exports = app;