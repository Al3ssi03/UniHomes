@echo off
echo ========================================
echo TEST FLUSSO COMPLETO UNI HOME
echo ========================================
echo.
echo 🏠 SISTEMA UNI HOME - TEST COMPLETO
echo.
echo FLUSSO DI TEST COMPLETO:
echo.
echo 1️⃣ REGISTRAZIONE/LOGIN:
echo    ✅ Vai su http://localhost:5173
echo    ✅ Clicca "🚀 Registrati" o "🔐 Accedi"
echo    ✅ Registra nuovo utente o usa esistente
echo    ✅ Verifica redirect a Dashboard
echo.
echo 2️⃣ PUBBLICAZIONE ANNUNCIO CON IMMAGINI:
echo    ✅ Dalla Dashboard clicca "📝 Pubblica Annuncio"
echo    ✅ Compila: Titolo, Descrizione, Prezzo, Città, Indirizzo
echo    ✅ IMPORTANTE: Carica 2-3 immagini (max 5MB ciascuna)
echo    ✅ Clicca "🚀 Pubblica Annuncio"
echo    ✅ Verifica: "✅ Annuncio pubblicato con successo!"
echo.
echo 3️⃣ VISUALIZZAZIONE ANNUNCI CON IMMAGINI:
echo    ✅ Vai su "🔍 Cerca" nella navbar
echo    ✅ Verifica che il tuo annuncio appaia con immagini
echo    ✅ Controlla che le immagini siano visibili
echo    ✅ Verifica badge "+N foto" se hai caricato più immagini
echo.
echo 4️⃣ DETTAGLIO ANNUNCIO E GALLERIA:
echo    ✅ Clicca "✨ Vedi Dettagli" su un annuncio
echo    ✅ Verifica galleria immagini completa
echo    ✅ Prova a cliccare sulle immagini per ingrandirle
echo    ✅ Controlla mappa e università vicine
echo    ✅ Verifica informazioni proprietario complete
echo.
echo 5️⃣ SISTEMA MESSAGGISTICA:
echo    ✅ Nel dettaglio annuncio, clicca "💬 Contatta Proprietario"
echo    ✅ Scrivi messaggio (es: "Ciao, sono interessato")
echo    ✅ Clicca "📤 Invia Messaggio"
echo    ✅ Verifica: "✅ Messaggio inviato con successo!"
echo.
echo 6️⃣ GESTIONE MESSAGGI:
echo    ✅ Vai su "💬 Messaggi" nella navbar
echo    ✅ Verifica che NON sia più bianco
echo    ✅ Controlla se appare la conversazione
echo    ✅ Se debug: controlla console browser (F12)
echo.
echo 7️⃣ GEOCODING E PROVINCIA:
echo    ✅ Negli annunci verifica geocoding preciso
echo    ✅ Controlla debug "🏠 Indirizzo ricercato"
echo    ✅ Verifica che includa provincia quando disponibile
echo.
echo CREDENZIALI TEST:
echo User 1: test@test.com / test123
echo User 2: mario@rossi.com / password123
echo.
echo URLS:
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo Messaggi: http://localhost:5173/messages
echo.
pause
echo.
echo 🚀 Avvio test completo...
echo Aprendo browser...
start http://localhost:5173
echo.
echo ✅ Segui il flusso sopra step-by-step!
echo ❌ Se trovi problemi, annota e testa il prossimo step
echo.
echo Premi un tasto quando hai completato tutti i test...
pause >nul
echo.
echo 📊 RISULTATI ATTESI:
echo ✅ Registrazione/Login funzionante
echo ✅ Pubblicazione annunci con immagini
echo ✅ Visualizzazione immagini in lista e dettaglio
echo ✅ Messaggistica funzionante (non più pagina bianca)
echo ✅ Geocoding con provincia
echo ✅ Mappa e università accurate
echo ✅ Interfaccia moderna e responsive
echo.
echo 🎉 Se tutto funziona: UNI HOME È COMPLETAMENTE OPERATIVO!
echo.
pause
