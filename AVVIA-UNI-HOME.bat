@echo off
echo.
echo ========================================
echo    🏠 UNI HOME - AVVIO APPLICAZIONE
echo    ✅ TUTTI I BUG RISOLTI - V2.0
echo ========================================
echo.

echo [1/3] Avvio Backend Server (con JWT + Upload)...
cd /d "c:\Users\AlessioAndriulo\Music\UniHomes\server"
start "UNI-HOME-BACKEND" cmd /k "npm run dev"

echo [2/3] Attendo avvio backend...
timeout /t 3 /nobreak >nul

echo [3/3] Avvio Frontend Server (con Preview Immagini)...
cd /d "c:\Users\AlessioAndriulo\Music\UniHomes\frontend"
start "UNI-HOME-FRONTEND" cmd /k "npm run dev"

echo.
echo ✅ Applicazione UNI Home V2.0 avviata!
echo.
echo 📡 Backend:  http://localhost:5000
echo 🌐 Frontend: http://localhost:5177 (o porta disponibile)
echo 🔑 Login:    http://localhost:5177/auth
echo 🏠 Cerca:    http://localhost:5177/listings  
echo 📝 Pubblica: http://localhost:5177/publish
echo.
echo 👤 Utente di test:
echo    Username: test
echo    Password: test123
echo.
echo 🎉 FUNZIONALITÀ DISPONIBILI:
echo    ✅ Login/Registrazione 
echo    ✅ Upload immagini (max 5, con anteprima)
echo    ✅ Pubblicazione annunci completi
echo    ✅ Ricerca e filtri annunci
echo    ✅ Navigazione navbar completa
echo    ✅ Database popolato con esempi
echo.
echo Premi un tasto per aprire l'applicazione...
pause >nul

start "" "http://localhost:5177"

echo.
echo 🚀 UNI Home V2.0 è ora attivo e COMPLETAMENTE FUNZIONALE!
echo 📷 Testa l'upload delle immagini nel form di pubblicazione!
echo Chiudi questa finestra quando hai finito.
echo.
