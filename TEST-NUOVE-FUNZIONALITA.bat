@echo off
echo === TEST COMPLETO NUOVE FUNZIONALITÀ ===
echo.

echo 🎯 Test delle nuove funzionalità implementate:
echo ✅ 1. Backend supporta nuovi campi User (citta, provincia, professione, biografia)
echo ✅ 2. Frontend mostra tutte le info del proprietario
echo ✅ 3. Messaggistica compatibile con frontend  
echo ✅ 4. Form registrazione con più campi
echo.

echo 🌐 Avvio sistema completo per test...

start "UNI-HOME Backend" cmd /k "cd server && echo 🚀 Backend in avvio... && npm start"

timeout /t 5 /nobreak > nul

start "UNI-HOME Frontend" cmd /k "cd frontend && echo 🎨 Frontend in avvio... && npm run dev"

echo.
echo 📋 ISTRUZIONI PER IL TEST:
echo.
echo 1. Attendi che backend e frontend si avviino (circa 10 secondi)
echo 2. Vai su http://localhost:5173
echo 3. Prova la registrazione con i nuovi campi:
echo    - Email
echo    - Città  
echo    - Provincia
echo    - Professione
echo    - Biografia
echo.
echo 4. Dopo la registrazione, crea un annuncio
echo 5. Visualizza il dettaglio dell'annuncio
echo 6. Verifica che tutte le info del proprietario siano visibili
echo 7. Prova a inviare un messaggio al proprietario
echo.
echo 🎉 Se tutto funziona: NUOVE FUNZIONALITÀ COMPLETATE!
echo.
pause

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
