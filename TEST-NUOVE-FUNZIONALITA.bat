@echo off
echo 🏠 UNI Home - Test Nuove Funzionalità

echo.
echo ===================================
echo    AVVIO SISTEMA MIGLIORATO
echo ===================================
echo.

echo 🔄 Avvio Backend...
cd /d "%~dp0server"
start "UNI Home Backend" cmd /k "node index.js"

echo.
echo ⏳ Attendo 3 secondi per l'avvio del backend...
timeout /t 3 >nul

echo.
echo 🔄 Avvio Frontend...
cd /d "%~dp0frontend"
start "UNI Home Frontend" cmd /k "npm run dev"

echo.
echo ⏳ Attendo 5 secondi per l'avvio del frontend...
timeout /t 5 >nul

echo.
echo 🌐 Apertura browser...
start "" "http://localhost:3000"

echo.
echo ✅ UNI Home con Nuove Funzionalità avviato!
echo.
echo 📋 NUOVE FUNZIONALITÀ:
echo    ✅ Pagina dettaglio annuncio migliorata
echo    ✅ Mappa interattiva con posizione alloggio  
echo    ✅ Sistema di messaggistica integrato
echo    ✅ Contatto diretto con proprietario
echo    ✅ Interfaccia chat moderna
echo.
echo 🗺️ MAPPA INTERATTIVA:
echo    - Visualizza posizione esatta dell'alloggio
echo    - Mostra distanze dalle università
echo    - Navigazione su OpenStreetMap
echo.
echo 💬 MESSAGGISTICA:
echo    - Contatto diretto con proprietari
echo    - Chat in tempo reale
echo    - Storico conversazioni
echo    - Notifiche messaggi non letti
echo.
echo 🎨 DESIGN MIGLIORATO:
echo    - Grafica moderna ma pulita  
echo    - Interfaccia intuitiva
echo    - Responsive design
echo    - Animazioni fluide
echo.
pause
