@echo off
echo === TEST GEOLOCALIZZAZIONE CON PROVINCIA ===
echo.

echo 🎯 Test della nuova funzionalità provincia per migliorare la precisione della mappa
echo.

echo 📋 MIGLIORAMENTI IMPLEMENTATI:
echo ✅ 1. Campo provincia aggiunto al form di creazione annuncio
echo ✅ 2. Backend aggiornato per salvare la provincia
echo ✅ 3. Geocoding con indirizzo + città + provincia (massima precisione)
echo ✅ 4. Fallback progressivo: indirizzo completo → città + provincia → solo città → coordinate predefinite
echo ✅ 5. Visualizzazione provincia nei dettagli annuncio
echo.

echo 🌐 Avvio sistema per test...

start "UNI-HOME Backend" cmd /k "cd server && echo 🚀 Backend con supporto provincia... && npm start"

timeout /t 5 /nobreak > nul

start "UNI-HOME Frontend" cmd /k "cd frontend && echo 🎨 Frontend con campo provincia... && npm run dev"

echo.
echo 📋 ISTRUZIONI PER IL TEST:
echo.
echo 1. Attendi che il sistema si avvii (circa 10 secondi)
echo 2. Vai su http://localhost:5173
echo 3. Effettua login o registrazione
echo 4. Crea un NUOVO ANNUNCIO con:
echo    - Titolo: Test Provincia
echo    - Prezzo: 500
echo    - Città: Città comune (es: San Giovanni)
echo    - Provincia: RM (per distinguere da altre San Giovanni)
echo    - Indirizzo: Via precisa con numero civico
echo.
echo 5. Visualizza il dettaglio dell'annuncio
echo 6. Verifica che la mappa carichi con precisione maggiore
echo 7. Controlla i log di geocoding nella console del browser
echo.
echo 🎯 RISULTATO ATTESO:
echo - Geocoding ultra-preciso con "Via, Città, Provincia, Italia"
echo - Mappa posizionata correttamente senza ambiguità
echo - Distanze università accurate
echo.
echo 🎉 Se funziona: GEOLOCALIZZAZIONE MIGLIORATA!
echo.
pause
