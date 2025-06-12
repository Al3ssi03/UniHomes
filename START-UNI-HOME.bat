@echo off
color 0A
title UNI Home - Sistema Avvio Completo

echo.
echo =====================================
echo    🏠 UNI HOME - AVVIO SISTEMA 🏠    
echo =====================================
echo.
echo [%time%] Avvio del sistema UNI Home...
echo.

echo [INFO] Controllo dipendenze backend...
cd server
if not exist node_modules (
    echo [INSTALL] Installazione dipendenze backend...
    call npm install --silent
) else (
    echo [OK] Dipendenze backend già installate
)

echo.
echo [INFO] Controllo dipendenze frontend...
cd ../frontend
if not exist node_modules (
    echo [INSTALL] Installazione dipendenze frontend...
    call npm install --silent
) else (
    echo [OK] Dipendenze frontend già installate
)

echo.
echo [AVVIO] Backend server in ascolto sulla porta 5000...
cd ../server
start "UNI Home Backend" /min cmd /c "node index.js"

echo [WAIT] Attesa avvio backend (3 secondi)...
timeout /t 3 /nobreak > nul

echo.
echo [AVVIO] Frontend development server...
cd ../frontend
start "UNI Home Frontend" cmd /c "npm run dev"

echo.
echo [WAIT] Attesa avvio frontend (5 secondi)...
timeout /t 5 /nobreak > nul

echo.
echo =====================================
echo     ✅ UNI HOME AVVIATO CON SUCCESSO
echo =====================================
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:5000
echo.
echo Premi un tasto per aprire l'app nel browser...
pause > nul

start http://localhost:5173

cd ..
echo.
echo [INFO] Sistema UNI Home in esecuzione!
echo Chiudi questa finestra per terminare.
pause > nul
