@echo off
echo 🗺️ UNI Home - Test Mappa e Università

echo.
echo ===================================
echo    TEST MAPPA INTERATTIVA
echo ===================================
echo.

echo 🔄 Avvio sistema completo...
cd /d "%~dp0server"
start "Backend" cmd /k "node index.js"

timeout /t 3 >nul

cd /d "%~dp0frontend"  
start "Frontend" cmd /k "npm run dev"

timeout /t 5 >nul

echo.
echo 🌐 Apertura browser per test...
start "" "http://localhost:3000"

echo.
echo ✅ Sistema avviato!
echo.
echo 📋 FUNZIONALITÀ DA TESTARE:
echo.
echo 🗺️ MAPPA INTERATTIVA:
echo    1. Vai su "Cerca" → Lista annunci
echo    2. Clicca "Vedi Dettagli" su un annuncio
echo    3. Scorri fino alla sezione "Posizione e Università Vicine"
echo    4. Verifica che la mappa si carichi correttamente
echo    5. Controlla che mostri la posizione dell'alloggio
echo.
echo 🎓 DISTANZE UNIVERSITÀ:
echo    1. Nella stessa sezione mappa
echo    2. Verifica la lista "Università più vicine"
echo    3. Controlla distanze in km e tempo stimato
echo    4. Verifica che siano ordinate per vicinanza
echo.
echo 💬 MESSAGGISTICA:
echo    1. Clicca "Contatta Proprietario"
echo    2. Scrivi un messaggio di prova
echo    3. Invia il messaggio
echo    4. Vai su "Messaggi" per verificare
echo.
echo 🎨 GRAFICA:
echo    - Design mantiene stile originale
echo    - Gradiente blu/viola preservato
echo    - Layout pulito e organizzato
echo    - Responsive su tutti i dispositivi
echo.
echo 🔧 CARATTERISTICHE TECNICHE:
echo    ✅ Mappa con iframe OpenStreetMap (no dipendenze)
echo    ✅ Geocoding automatico indirizzi
echo    ✅ Calcolo distanze haversine
echo    ✅ 12+ università italiane principali
echo    ✅ Ordinamento per vicinanza
echo    ✅ Tempo stimato trasporti
echo.
pause
