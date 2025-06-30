@echo off
echo.
echo =========================================================
echo 🔧 TEST CORREZIONI GEOCODING E MESSAGGISTICA
echo =========================================================
echo.
echo Questo script testa le correzioni per:
echo 1. Geocoding che mostra sempre l'indirizzo completo
echo 2. Prevenzione di messaggi a se stessi
echo 3. Nascondimento pulsante "Contatta" sui propri annunci
echo.

echo ⚡ Avvio del backend...
cd /d "c:\Users\AlessioAndriulo\Music\UniHomes\server"
start "UNI-HOME-BACKEND" cmd /k "npm run dev"

echo.
echo ⏳ Attesa avvio backend (3 secondi)...
timeout /t 3 /nobreak >nul

echo.
echo ⚡ Avvio del frontend...
cd /d "c:\Users\AlessioAndriulo\Music\UniHomes\frontend"
start "UNI-HOME-FRONTEND" cmd /k "npm run dev"

echo.
echo ⏳ Attesa avvio frontend (5 secondi)...
timeout /t 5 /nobreak >nul

echo.
echo 🌐 Apertura dell'applicazione...
start "UNI-HOME-APP" "http://localhost:5173"

echo.
echo =========================================================
echo ✅ ISTRUZIONI TEST:
echo =========================================================
echo.
echo 📋 CHECKLIST GEOCODING:
echo   1. Apri un annuncio qualsiasi
echo   2. Controlla la sezione mappa
echo   3. Verifica che "Indirizzo ricercato" mostri SEMPRE:
echo      - Se c'è indirizzo: "Via X, Città, Provincia, Italia"
echo      - Se no indirizzo: "Città, Provincia, Italia"
echo      - NON deve mostrare solo città quando c'è un indirizzo
echo.
echo 📋 CHECKLIST MESSAGGISTICA:
echo   1. Crea 2 account diversi (es: mario@test.com, anna@test.com)
echo   2. Con mario: crea un annuncio
echo   3. Con mario: vai al dettaglio del TUO annuncio
echo      ❌ NON deve apparire "Contatta Proprietario"
echo   4. Con anna: vai al dettaglio dell'annuncio di mario
echo      ✅ DEVE apparire "Contatta Proprietario"
echo   5. Con anna: prova a contattare mario
echo      ✅ DEVE funzionare
echo   6. Con mario: prova a contattare se stesso
echo      ❌ NON deve permetterlo (messaggio errore)
echo.
echo 🔍 CONTROLLI DEBUG:
echo   - Apri Console Sviluppatore (F12)
echo   - Controlla i log per geocoding
echo   - Controlla i log per messaggistica
echo   - Verifica recipientId != userId
echo.
echo =========================================================
echo.
pause
