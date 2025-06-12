# 🏠 AlloggiFinder

**La piattaforma completa per trovare alloggi per studenti e lavoratori**

![Status](https://img.shields.io/badge/status-✅%20FUNZIONANTE-brightgreen)
![Frontend](https://img.shields.io/badge/frontend-React%2018-blue)
![Backend](https://img.shields.io/badge/backend-Node.js-green)
![Database](https://img.shields.io/badge/database-SQLite-orange)

## 🚀 Avvio Rapido

**Avvia tutto con un click:**
```bash
START-ALLOGGI-FINDER.bat
```

**Oppure manualmente:**

1. **Backend Server:**
   ```bash
   cd server
   npm install
   node index.js
   ```
   Server disponibile su: http://localhost:5000

2. **Frontend Server:**
   ```bash
   cd frontend  
   npm install
   npm run dev
   ```
   App disponibile su: http://localhost:5176

## ✨ Caratteristiche

- 🔍 **Ricerca avanzata** di alloggi
- 📱 **Design responsive** per tutti i dispositivi  
- 💬 **Chat integrata** tra utenti e proprietari
- 🔐 **Autenticazione JWT** sicura
- 📧 **Sistema email** per recupero password
- 🗺️ **Mappe interattive** con Leaflet
- 📊 **Dashboard** per gestire i propri annunci

## 🛠️ Tecnologie

### Frontend
- **React 18** con Vite
- **React Router** per navigazione
- **Tailwind CSS** per styling
- **Axios** per API calls
- **React Leaflet** per mappe

### Backend  
- **Node.js** con Express
- **SQLite** database con Sequelize ORM
- **JWT** per autenticazione
- **Multer** per upload file
- **Nodemailer** per email

## 📁 Struttura Progetto

```
AlloggiFinder/
├── 🚀 START-ALLOGGI-FINDER.bat  # Script avvio completo
├── frontend/                     # App React
│   ├── src/
│   │   ├── components/          # Componenti React
│   │   ├── pages/              # Pagine dell'app
│   │   └── main.jsx           # Entry point
│   └── package.json
├── server/                      # API Backend
│   ├── routes/                 # Route API
│   ├── models/                 # Modelli database
│   ├── config/                 # Configurazioni
│   └── index.js               # Server principale
└── README.md
```

## 🔧 Risoluzione Problemi

**Schermata bianca?**
- ✅ Problema risolto: Era un conflitto con React 19
- ✅ Ora usa React 18 stabile

**Server non si avvia?**
- Controlla che le porte 5000 e 5176 siano libere
- Verifica che Node.js sia installato

**Database non funziona?**
- Il database SQLite viene creato automaticamente
- File: `server/database.sqlite`

## 👥 Account di Test

```
Email: mario.rossi@email.com
Password: password123

Email: giulia.bianchi@email.com  
Password: password123
```

## 🎯 Prossimi Sviluppi

- [ ] Sistema di recensioni
- [ ] Notifiche push
- [ ] App mobile
- [ ] Integrazione pagamenti
- [ ] Sistema di prenotazioni

## 📞 Supporto

Per problemi o domande, controlla i log del server o consulta la documentazione nel codice.

---

**Sviluppato con ❤️ per studenti e lavoratori in cerca di alloggio**
