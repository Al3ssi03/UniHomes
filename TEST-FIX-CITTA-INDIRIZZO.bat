@echo off
echo.
echo 🏙️ UNI Home - Test Fix Città e Indirizzo
echo ==========================================
echo.
echo 🔧 Fix implementati:
echo   ✅ Supporto per campo "citta" (senza accento) dal form
echo   ✅ Funzioni helper per gestire diverse varianti del campo città
echo   ✅ Visualizzazione separata di Indirizzo e Città
echo   ✅ Debug info con indirizzo completo corretto
echo   ✅ Gestione "undefined" risolto
echo.

echo 📍 Avvio backend server...
start "Backend" cmd /k "cd /d server && node index.js"

timeout /t 3 /nobreak >nul

echo 🎯 Avvio frontend con fix città/indirizzo...
start "Frontend" cmd /k "cd /d frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo 🌐 Apertura browser per test...
start "" "http://localhost:5173"

echo.
echo ✅ Sistema avviato!
echo.
echo 🧪 Test da eseguire:
echo.
echo   📝 TEST CREAZIONE ANNUNCIO:
echo     1. Vai su "Pubblica Annuncio"
echo     2. Compila tutti i campi inclusa la Città
echo     3. Pubblica l'annuncio
echo.
echo   🏠 TEST VISUALIZZAZIONE:
echo     1. Vai sui dettagli dell'annuncio appena creato
echo     2. Verifica che appaia:
echo        - 📍 Indirizzo: Via nome strada, numero
echo        - 🏙️ Città: Nome Città
echo     3. NON deve più apparire "undefined"
echo.
echo   🗺️ TEST MAPPA:
echo     1. Controlla la sezione debug:
echo        - "🏠 Indirizzo ricercato: Via X, Città Y"
echo        - NON deve più apparire "undefined"
echo     2. La mappa deve caricarsi con posizione precisa
echo.
echo   📊 CONTROLLI DEBUG:
echo     1. Apri Console Browser (F12)
echo     2. Verifica log:
echo        - "🏙️ Città estratta: NomeCittà"
echo        - "🏠 Indirizzo estratto: ViaIndirizzo"
echo        - "✅ Geocoding PRECISO riuscito"
echo.
echo 🔍 Se vedi ancora "undefined":
echo   - Controlla che il campo Città sia compilato nel form
echo   - Verifica i log del backend per il salvataggio
echo   - Controlla che il database riceva il campo "citta"
echo.
pause
