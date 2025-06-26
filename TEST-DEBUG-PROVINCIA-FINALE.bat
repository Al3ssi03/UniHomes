@echo off
echo ========================================
echo TEST DEBUG PROVINCIA - VERSIONE FINALE
echo ========================================
echo.
echo Questo test verifica che il debug "Indirizzo ricercato" 
echo mostri correttamente la provincia per migliorare il geocoding.
echo.
echo PASSI DEL TEST:
echo 1. Accedi come utente esistente
echo 2. Vai su qualsiasi annuncio con provincia specificata
echo 3. Controlla che nel debug info appaia:
echo    "🏠 Indirizzo ricercato: Via Torre, 20, Erchie, BR, Italia"
echo    (invece di "Via Torre, 20, Erchie" senza provincia)
echo.
echo 4. Verifica che il geocoding sia più veloce e preciso
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
echo Aprendo il browser...
start http://localhost:5173
echo.
echo Il test è completo quando vedi la provincia nel debug!
echo Premi un tasto per uscire...
pause >nul
