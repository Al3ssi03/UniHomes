@echo off
echo.
echo 🔧 UNI Home - Test Bug Fix Completo
echo ========================================
echo.
echo 🎯 Bug Risolti in questa versione:
echo   1. ✅ Mappa che non si caricava (geocoding migliorato)
echo   2. ✅ Data "Invalid Date" (gestione errori date)
echo   3. ✅ Errore invio messaggi (debug e fallback)
echo   4. ✅ Dati proprietario dinamici
echo   5. ✅ Coordinate predefinite per 30+ città
echo.

echo 📍 Avvio backend server...
start "Backend" cmd /k "cd /d server && node index.js"

timeout /t 3 /nobreak >nul

echo 🎯 Avvio frontend con version FIXED...
start "Frontend" cmd /k "cd /d frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo 🌐 Apertura browser per test completo...
start "" "http://localhost:5173"

echo.
echo ✅ Sistema avviato!
echo.
echo 🧪 Test da eseguire:
echo.
echo   📍 TEST MAPPA:
echo     - Vai su qualsiasi annuncio
echo     - Verifica che la mappa si carichi entro 3 secondi
echo     - Controlla le coordinate nella sezione debug
echo     - Verifica che le università vicine appaiano
echo.
echo   📅 TEST DATA:
echo     - Verifica che la data di pubblicazione sia formattata correttamente
echo     - Non deve più apparire "Invalid Date"
echo.
echo   💬 TEST MESSAGGI:
echo     - Clicca "Contatta Proprietario"
echo     - Scrivi un messaggio di prova
echo     - Verifica che si invii senza errori
echo     - Controlla la console per log dettagliati
echo.
echo   🏠 TEST DATI PROPRIETARIO:
echo     - Verifica che nome, email, telefono siano dinamici
echo     - Non devono essere più hardcoded
echo.
echo 🔍 Debug: Apri la Console del Browser (F12) per vedere i log dettagliati
echo.
pause
