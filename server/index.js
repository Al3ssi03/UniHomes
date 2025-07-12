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
require('./models/city');

// Importa routes
const { router: authRoutes } = require('./routes/auth');
const announcementsRoutes = require('./routes/announcements');
const profileRoutes = require('./routes/profile');
const messagesRoutes = require('./routes/messages');
const citiesRoutes = require('./routes/cities');
const geocodingRoutes = require('./routes/geocoding');
const paymentsRoutes = require('./routes/payments');

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
      cb(new Error('Solo file immagine sono permessi'));
    }
  }
});

// Middleware globali
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve file statici (immagini)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path}`);
  if (req.method === 'POST' && req.path.includes('/announcements')) {
    console.log('📋 Headers:', req.headers);
    console.log('📋 Content-Type:', req.headers['content-type']);
  }
  next();
});

// Debug middleware
app.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/api/announcements') {
    console.log('📋 Body prima di multer:', req.body);
    console.log('📋 Files prima di multer:', req.files);
  }
  next();
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/geocoding', geocodingRoutes);
app.use('/api/payments', paymentsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: [
      'Authentication',
      'Announcements',
      'Messages', 
      'Profile Management',
      'Cities',
      'Geocoding',
      'Payments'
    ]
  });
});

// Test endpoint per upload file
app.post('/api/test-upload', upload.array('immagini', 5), (req, res) => {
  console.log('📋 Test Upload - Body:', req.body);
  console.log('📋 Test Upload - Files:', req.files);
  
  res.json({
    message: 'Test upload completato',
    body: req.body,
    files: req.files ? req.files.map(f => ({
      filename: f.filename,
      originalname: f.originalname,
      size: f.size,
      mimetype: f.mimetype
    })) : []
  });
});

// Gestione route non trovate
app.use((req, res) => {
  console.log(`❌ Route non trovata: ${req.method} ${req.path}`);
  res.status(404).json({ 
    message: 'Endpoint non trovato',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Gestione errori globale
app.use((error, req, res, next) => {
  console.error('❌ Errore server:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File troppo grande. Massimo 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Troppi file. Massimo 5 file.' });
    }
  }
  
  res.status(500).json({ 
    message: 'Errore interno del server',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Errore interno'
  });
});

// Avvio del server
async function startServer() {
  try {
    // Test connessione database
    await sequelize.authenticate();
    console.log('✅ Connessione al database riuscita');
    
    // Sincronizza modelli (solo in development)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: false });
      console.log('✅ Modelli database sincronizzati');
    }
    
    // Avvia server
    app.listen(PORT, () => {
      console.log(`🚀 Server in ascolto sulla porta ${PORT}`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      
      console.log('\n📋 Endpoints disponibili:');
      console.log('  🔐 /api/auth - Autenticazione');
      console.log('  🏠 /api/announcements - Annunci');
      console.log('  👤 /api/profile - Profili utente');
      console.log('  💬 /api/messages - Messaggi');
      console.log('  🏛️ /api/cities - Città');
      console.log('  🗺️ /api/geocoding - Geolocalizzazione');
      console.log('  💳 /api/payments - Pagamenti');
      console.log('  📁 /uploads - File statici');
    });
    
  } catch (error) {
    console.error('❌ Errore avvio server:', error);
    process.exit(1);
  }
}

// Gestione graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Ricevuto SIGINT, chiusura server...');
  try {
    await sequelize.close();
    console.log('✅ Connessione database chiusa');
    process.exit(0);
  } catch (error) {
    console.error('❌ Errore durante la chiusura:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Ricevuto SIGTERM, chiusura server...');
  try {
    await sequelize.close();
    console.log('✅ Connessione database chiusa');
    process.exit(0);
  } catch (error) {
    console.error('❌ Errore durante la chiusura:', error);
    process.exit(1);
  }
});

// Avvia il server
startServer();

module.exports = app;