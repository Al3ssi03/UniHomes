# 🏠 AlloggiFinder - App di Ricerca Alloggi per Studenti e Lavoratori

> ✨ **AGGIORNAMENTO GIUGNO 2025**: Sistema di autenticazione completamente implementato!

AlloggiFinder è un'applicazione web full-stack che consente di pubblicare, cercare e gestire annunci di stanze o appartamenti in affitto, con funzionalità di messaggistica e notifiche integrate.

## 🆕 Novità - Sistema di Autenticazione

### ✅ Implementato
- **🔐 Autenticazione Completa**: Login/Registrazione funzionante
- **🔍 Diagnostica Real-time**: Verifica automatica stato backend
- **📱 UI Responsive**: Design ottimizzato per desktop e mobile
- **🛡️ Sicurezza**: JWT tokens, password hashing, validazione input
- **🎯 UX Avanzata**: Loading states, error handling, form validation

### 🚀 Avvio Rapido
```bash
# Avvia tutto automaticamente
./AVVIA-SISTEMA-AUTH.bat

# Oppure manualmente:
# Terminal 1: Backend
cd server && node index.js

# Terminal 2: Frontend  
cd frontend && npm run dev
```

### 🧪 Test Sistema
Apri `TEST-SISTEMA-AUTH.html` per verificare che tutto funzioni correttamente.

---

## 📦 Requisiti
- Node.js (v18+ consigliato)
- npm

---

## 📁 Struttura del Progetto
```
root/
├── server/         # Backend Express (API REST + autenticazione JWT)
├── client/         # Frontend React (UI + routing)
└── README.md       # Documentazione
```

---

## 🚀 Avvio del Progetto

### 1️⃣ Backend (Express)
```bash
cd server
npm install
node index.js
```
📍 Il server sarà attivo su `http://localhost:3001`

### 2️⃣ Frontend (React)
```bash
cd client
npm install
npm run dev    # oppure npm start
```
📍 L'app React sarà visibile su `http://localhost:5173` (o `http://localhost:3000`)

---

## 🔐 Autenticazione
- Registrazione e login con JWT
- Ruoli supportati: `tenant` (studente/lavoratore), `landlord` (proprietario)
- Accesso condizionato a rotte protette (pubblicazione, gestione annunci, messaggistica)

---

## ✍️ Funzionalità Principali

### 👤 Area Utente
- Registrazione / Login / Logout
- Visualizzazione annunci personali
- Modifica / eliminazione annunci
- Accesso all'inbox messaggi

### 📍 Annunci
- Pubblicazione con foto, descrizione, filtri per città, tipo, prezzo, università
- Visualizzazione con paginazione e ricerca
- Dettaglio annuncio + chat 1:1

### 💬 Chat & Notifiche
- Messaggistica privata tra utenti
- Notifiche per nuovi messaggi non letti
- Inbox personale per accedere alle conversazioni

---

## 🔗 Rotte Principali (Frontend)
- `/` → Homepage (motore di ricerca annunci)
- `/auth` → Login / Registrazione
- `/crea` → Pubblica annuncio *(protetta)*
- `/i-miei-annunci` → Area personale *(protetta)*
- `/modifica/:id` → Modifica annuncio *(protetta)*
- `/annuncio/:id` → Dettaglio annuncio + chat
- `/inbox` → Inbox messaggi *(protetta)*

---

## 📌 Note
- I dati sono salvati **in memoria** lato backend. Nessun DB persistente per ora.
- Le immagini vengono caricate nella cartella `server/uploads`
- Il JWT viene salvato nel `localStorage` del browser

---

## 🧪 Sviluppi Futuri
- Aggiunta di un database (es. SQLite, PostgreSQL)
- Geolocalizzazione avanzata con Leaflet/Mapbox
- Ricerca full-text e filtro avanzato
- Notifiche real-time (Socket.io)
- Sezione Admin (approvazione annunci, ban utenti)

---

> Progetto sviluppato con ❤️ da Alessio
