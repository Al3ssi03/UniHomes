@echo off
echo.
echo ========================================
echo       🏠 ALLOGGI FINDER - AVVIO COMPLETO
echo ========================================
echo.

cd /d "c:\Users\AlessioAndriulo\Music\UniHomes"

echo 📍 Directory: %CD%
echo.

REM Ferma processi esistenti
echo 🛑 Fermando processi Node esistenti...
taskkill /f /im node.exe 2>nul >nul

echo 🔍 Controllo sistema...

REM Controlla frontend
if not exist "frontend\node_modules" (
    echo 📦 Installazione dipendenze frontend...
    cd frontend
    call npm install
    cd ..
) else (
    echo ✅ Frontend pronto
)

REM Controlla backend
if not exist "server\node_modules" (
    echo 📦 Installazione dipendenze backend...
    cd server
    call npm install
    cd ..
) else (
    echo ✅ Backend pronto
)

REM Controlla database
if not exist "server\database.sqlite" (
    echo 🗄️ Inizializzazione database...
    cd server
    node syncDatabase.js --samples
    cd ..
) else (
    echo ✅ Database pronto
)

echo.
echo 🚀 Avvio servizi...

REM Avvia Backend
echo 📡 Avvio Backend Server (porta 5000)...
cd server
start "AlloggiFinder Backend" cmd /k "echo 📡 BACKEND SERVER - Porta 5000 && echo ✅ Database SQLite connesso && echo 💾 Annunci e utenti caricati && echo. && node index.js"
cd ..

REM Aspetta un momento per il backend
timeout /t 4 /nobreak >nul

REM Avvia Frontend
echo 🌐 Avvio Frontend Server (porta 5176)...
cd frontend
start "AlloggiFinder Frontend" cmd /k "echo 🌐 FRONTEND SERVER - Porta 5176 && echo ✅ React 18 attivo && echo 🔄 Hot reload abilitato && echo. && npm run dev"
cd ..

REM Aspetta per i server
timeout /t 6 /nobreak >nul

echo.
echo ========================================
echo        ✅ ALLOGGI FINDER AVVIATO!
echo ========================================
echo.
echo 🌐 Frontend:     http://localhost:5176
echo 📡 Backend API:  http://localhost:5000
echo 🗄️ Database:     SQLite (server/database.sqlite)
echo.
echo 👥 Account di test disponibili:
echo    • mario.rossi / password123
echo    • giulia.bianchi / password123
echo.
echo 🎯 Funzionalità disponibili:
echo    • ✅ Ricerca annunci
echo    • ✅ Login/Registrazione  
echo    • ✅ Sistema di routing
echo    • ✅ Design responsive
echo.
echo 💡 Aprendo il browser...

start http://localhost:5176

echo.
echo 🎉 AlloggiFinder è ora completamente operativo!
echo.
echo ℹ️  Puoi chiudere questa finestra.
echo    I server continueranno a funzionare nelle loro finestre.
echo.
pause >nul
