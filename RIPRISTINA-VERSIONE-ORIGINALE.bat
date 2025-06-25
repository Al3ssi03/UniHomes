@echo off
echo 🏠 UNI Home - Avvio Versione Originale Ripristinata

echo.
echo ===================================
echo    RIPRISTINO VERSIONE ORIGINALE
echo ===================================
echo.

echo 🔄 Avvio Backend (Server)...
cd /d "%~dp0server"
start "UNI Home Backend" cmd /k "node index.js"

echo.
echo ⏳ Attendo 3 secondi per l'avvio del backend...
timeout /t 3 >nul

echo.
echo 🔄 Avvio Frontend (Interfaccia)...
cd /d "%~dp0frontend"
start "UNI Home Frontend" cmd /k "npm run dev"

echo.
echo ⏳ Attendo 5 secondi per l'avvio del frontend...
timeout /t 5 >nul

echo.
echo 🌐 Apertura browser...
start "" "http://localhost:3000"

echo.
echo ✅ UNI Home Versione Originale avviata!
echo.
echo 📋 ISTRUZIONI:
echo    - Backend: http://localhost:5000
echo    - Frontend: http://localhost:3000
echo    - Per arrestare: chiudi le finestre cmd del backend e frontend
echo.
echo 💡 RIPRISTINO COMPLETATO:
echo    - Rimossa grafica moderna non gradita
echo    - Ripristinata funzionalità pubblicazione annunci
echo    - Ripristinata interfaccia originale semplice
echo.
pause
