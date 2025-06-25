@echo off
echo.
echo 🎯 UNI Home - Test Geocoding PRECISO
echo ========================================
echo.
echo 🔧 Modifiche apportate:
echo   ✅ Priorità al geocoding dell'indirizzo completo
echo   ✅ API multiple (Nominatim + Photon)  
echo   ✅ Coordinate predefinite solo come fallback
echo   ✅ Indicatori visivi preciso vs approssimativo
echo   ✅ Debug info migliorato
echo.

echo 📍 Avvio backend server...
start "Backend" cmd /k "cd /d server && node index.js"

timeout /t 3 /nobreak >nul

echo 🎯 Avvio frontend con geocoding PRECISO...
start "Frontend" cmd /k "cd /d frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo 🌐 Apertura browser per test geocoding...
start "" "http://localhost:5173"

echo.
echo ✅ Sistema avviato!
echo.
echo 🧪 Test da eseguire:
echo.
echo   📍 TEST GEOCODING PRECISO:
echo     - Vai su un annuncio con indirizzo specifico
echo     - Verifica che appaia: "✅ Posizione precisa trovata"
echo     - La mappa deve mostrare la via esatta, non il centro città
echo     - Le distanze università devono essere precise
echo.
echo   📊 CONTROLLI VISIVI:
echo     - Verde = Posizione precisa dell'indirizzo
echo     - Arancione = Posizione approssimativa (solo città)
echo     - Debug info mostra tipo di coordinate usate
echo.
echo   🔍 TEST FALLBACK:
echo     - Se geocoding fallisce → coordinate città
echo     - Se tutto fallisce → coordinate Roma
echo.
echo   🎓 DISTANZE UNIVERSITÀ:
echo     - Con indirizzo preciso: distanze accurate
echo     - Con città generica: distanze dal centro città
echo.
echo 📝 Controlla la Console Browser (F12) per log dettagliati:
echo     - "✅ Geocoding PRECISO riuscito"
echo     - "⚠️ Usate coordinate predefinite"
echo.
pause
