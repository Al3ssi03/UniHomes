@echo off
echo.
echo =========================================================
echo 🔧 TEST FIX PAGINA MESSAGGI - PAGINA BIANCA
echo =========================================================
echo.
echo Questo script testa la correzione per la pagina bianca
echo che appariva quando c'erano messaggi.
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
echo ✅ ISTRUZIONI TEST PAGINA MESSAGGI:
echo =========================================================
echo.
echo 📋 SCENARIO 1 - NESSUN MESSAGGIO:
echo   1. Accedi con un account che non ha mai inviato/ricevuto messaggi
echo   2. Vai su "💬 Messaggi"
echo   3. ✅ DOVREBBE mostrare: "📭 Nessun Messaggio"
echo   4. ❌ NON dovrebbe mostrare: pagina bianca
echo.
echo 📋 SCENARIO 2 - CON MESSAGGI:
echo   1. Accedi con un account che ha inviato messaggi
echo   2. Vai su "💬 Messaggi"
echo   3. ✅ DOVREBBE mostrare: elenco conversazioni
echo   4. ❌ NON dovrebbe mostrare: pagina bianca
echo.
echo 🔍 CONTROLLI DEBUG:
echo   - Apri Console Sviluppatore (F12)
echo   - Vai su "💬 Messaggi"
echo   - Controlla che non ci siano errori JavaScript rossi
echo   - Controlla i log: "📨 [MessagesPageSafe]" o "📨 [MessagesPageDebug]"
echo.
echo 🆘 SE ANCORA PAGINA BIANCA:
echo   1. Apri Console Sviluppatore (F12)
echo   2. Vai su tab "Console"
echo   3. Cerca errori rossi
echo   4. Fai screenshot e condividi l'errore
echo.
echo =========================================================
echo 🛠️ SOLUZIONI IMPLEMENTATE:
echo =========================================================
echo.
echo ✅ Aggiunto controllo null safety per tutti gli oggetti
echo ✅ Creato componente MessagesPageSafe come fallback
echo ✅ Aggiunto try-catch in useEffect
echo ✅ Gestione sicura degli array e oggetti nested
echo ✅ Controlli per proprietà undefined/null
echo ✅ Fallback per date e stringhe mancanti
echo.
echo =========================================================
echo.
pause
