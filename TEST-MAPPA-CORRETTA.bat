@echo off
echo.
echo 🚀 UNI Home - Test Mappa Corretta
echo ========================================
echo.

echo 📍 Avvio backend server...
start "Backend" cmd /k "cd /d server && node index.js"

timeout /t 3 /nobreak >nul

echo 🎯 Avvio frontend con versione Fixed...
start "Frontend" cmd /k "cd /d frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo 🌐 Apertura browser per test mappa...
start "" "http://localhost:5173"

echo.
echo ✅ Test avviato! 
echo.
echo 📝 Cosa testare:
echo   - Vai su qualsiasi annuncio
echo   - Verifica che la mappa si carichi
echo   - Controlla le università vicine
echo   - Testa il pulsante "Contatta Proprietario"
echo.
echo 🔧 La versione Fixed dovrebbe risolvere:
echo   - Problema "Caricamento mappa in corso..."
echo   - Geocoding più robusto con fallback
echo   - Debug info per troubleshooting
echo.
pause
