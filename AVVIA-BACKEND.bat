@echo off
echo.
echo ========================================
echo    📡 AVVIO BACKEND ALLOGGI FINDER
echo ========================================
echo.

cd /d "c:\Users\AlessioAndriulo\Music\UniHomes\server"

echo 📍 Directory server: %CD%
echo.

echo 🔍 Controllo dipendenze...
if not exist node_modules (
    echo 📦 Installazione dipendenze...
    call npm install
) else (
    echo ✅ Dipendenze già installate
)
echo.

echo 🗄️ Controllo database...
if exist "database.sqlite" (
    echo ✅ Database già presente
) else (
    echo 🔄 Inizializzazione database...
    node syncDatabase.js --samples
)
echo.

echo 🚀 Avvio server backend...
echo.
echo ========================================
echo    📡 SERVER ATTIVO SU PORTA 5000
echo ========================================
echo.
echo 💡 API disponibili:
echo   • http://localhost:5000/api/announcements
echo   • http://localhost:5000/api/auth/login
echo   • http://localhost:5000/api/auth/register
echo.
echo ⚠️  Premi Ctrl+C per fermare il server
echo.

node index.js
