@echo off
echo.
echo ====================================
echo  🧪 Test Sistema AlloggiFinder
echo ====================================
echo.

echo 🔍 Controllo servizi in esecuzione...

echo.
echo 📡 Controllo Backend (porta 5000)...
netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo ✅ Backend in esecuzione sulla porta 5000
) else (
    echo ❌ Backend NON in esecuzione
    echo    Avvia con: cd server ^&^& npm start
)

echo.
echo 🌐 Controllo Frontend (porta 5173)...
netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend in esecuzione sulla porta 5173
) else (
    echo ❌ Frontend NON in esecuzione
    echo    Avvia con: cd frontend ^&^& npm run dev
)

echo.
echo 🔗 Test connessione API...
curl -s http://localhost:5000/api/test >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ API Backend risponde correttamente
) else (
    echo ❌ API Backend non risponde
)

echo.
echo 📋 Riepilogo funzionalità implementate:
echo ✅ Sistema di autenticazione JWT
echo ✅ Gestione annunci (CRUD)
echo ✅ Sistema di messaggistica
echo ✅ Upload immagini
echo ✅ Dashboard utente
echo ✅ Ricerca e filtri
echo ✅ Pagina dettaglio annunci
echo ✅ Design responsive
echo ✅ Navbar dinamica
echo ✅ Sistema notifiche toast

echo.
echo 🚀 URL di accesso:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo.

echo 👤 Account di test:
echo    Username: mario.rossi    / Password: password123
echo    Username: giulia.bianchi / Password: password123
echo.

echo 💡 Tip: Usa il file AVVIO-COMPLETO.bat per avviare tutto automaticamente
echo.

if "%1"=="--open" (
    echo 🌐 Apertura del browser...
    start "" "http://localhost:5173"
)

pause
