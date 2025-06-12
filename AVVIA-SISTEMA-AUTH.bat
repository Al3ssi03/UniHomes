@echo off
echo.
echo ========================================
echo    🔐 ALLOGGI FINDER - SISTEMA AUTH
echo ========================================
echo.

echo 🚀 Avvio del sistema di autenticazione...
echo.

REM Avvia backend
echo 📡 Avvio backend (porta 5000)...
start "Backend AlloggiFinder" cmd /k "cd /d c:\Users\AlessioAndriulo\Music\UniHomes\server && node index.js"

REM Aspetta 3 secondi
timeout /t 3 /nobreak > nul

REM Avvia frontend  
echo 🎨 Avvio frontend (porta 5173)...
start "Frontend AlloggiFinder" cmd /k "cd /d c:\Users\AlessioAndriulo\Music\UniHomes\frontend && npm run dev"

REM Aspetta 5 secondi
timeout /t 5 /nobreak > nul

REM Apri browser con l'app
echo 🌐 Apertura applicazione nel browser...
start "" "http://localhost:5173"

REM Apri test sistema
timeout /t 2 /nobreak > nul
echo 🧪 Apertura pagina di test...
start "" "file:///c:/Users/AlessioAndriulo/Music/UniHomes/TEST-SISTEMA-AUTH.html"

echo.
echo ✅ Sistema avviato!
echo.
echo 📋 Riepilogo:
echo   • Backend: http://localhost:5000
echo   • Frontend: http://localhost:5173  
echo   • Test: TEST-SISTEMA-AUTH.html
echo.
echo 🔐 Per testare l'autenticazione:
echo   1. Vai su http://localhost:5173
echo   2. Clicca "Accedi / Registrati"
echo   3. Crea un nuovo account
echo   4. Effettua il login
echo.
echo Premi un tasto per chiudere...
pause > nul
