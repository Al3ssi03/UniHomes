@echo off
echo ========================================
echo TEST FIX MESSAGGISTICA - recipientId
echo ========================================
echo.
echo PROBLEMA RISOLTO:
echo - Prima: recipientId era undefined (usava announcement.utente_id) 
echo - Ora: usa announcement.userId (campo corretto di Sequelize)
echo.
echo PASSI DEL TEST:
echo 1. Accedi come utente (es: test@test.com / test123)
echo 2. Vai su qualsiasi annuncio
echo 3. Clicca "💬 Contatta Proprietario"
echo 4. Scrivi un messaggio di test (es: "Ciao, sono interessato")
echo 5. Clicca "📤 Invia Messaggio"
echo.
echo RISULTATO ATTESO:
echo ✅ Messaggio inviato con successo (recipientId non più undefined)
echo.
echo CREDENZIALI TEST:
echo Email: test@test.com
echo Password: test123
echo.
echo SERVER URLS:
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
pause
echo.
echo Aprendo il browser per il test...
start http://localhost:5173
echo.
echo Controlla che il messaggio venga inviato senza errori!
echo Premi un tasto per uscire...
pause >nul
