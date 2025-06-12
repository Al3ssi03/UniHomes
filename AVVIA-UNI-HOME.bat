@echo off
echo.
echo ========================================
echo    🏠 UNI HOME - AVVIO APPLICAZIONE
echo ========================================
echo.

echo [1/3] Avvio Backend Server...
cd /d "c:\Users\AlessioAndriulo\Music\UniHomes\server"
start "UNI-HOME-BACKEND" cmd /k "npm run dev"

echo [2/3] Attendo avvio backend...
timeout /t 3 /nobreak >nul

echo [3/3] Avvio Frontend Server...
cd /d "c:\Users\AlessioAndriulo\Music\UniHomes\frontend"
start "UNI-HOME-FRONTEND" cmd /k "npm run dev"

echo.
echo ✅ Applicazione UNI Home avviata!
echo.
echo 📡 Backend:  http://localhost:5000
echo 🌐 Frontend: http://localhost:5177 (o porta disponibile)
echo 🔑 Login:    http://localhost:5177/auth
echo.
echo 👤 Utente di test:
echo    Username: test
echo    Password: test123
echo.
echo Premi un tasto per aprire l'applicazione...
pause >nul

start "" "http://localhost:5177"

echo.
echo 🎉 UNI Home è ora attivo e funzionante!
echo Chiudi questa finestra quando hai finito.
echo.
