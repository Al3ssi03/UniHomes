@echo off
echo.
echo ========================================
echo    🏠 ALLOGGI FINDER - STARTUP SCRIPT
echo ========================================
echo.

cd /d "c:\Users\AlessioAndriulo\Music\UniHomes"

echo 📁 Directory corrente: %CD%
echo.

echo 🔧 1. Controllo dipendenze frontend...
cd frontend
if not exist node_modules (
    echo 📦 Installazione dipendenze frontend...
    call npm install
) else (
    echo ✅ Dipendenze frontend già installate
)
echo.

echo 🔧 2. Controllo dipendenze backend...
cd ..\server
if not exist node_modules (
    echo 📦 Installazione dipendenze backend...
    call npm install
) else (
    echo ✅ Dipendenze backend già installate
)
echo.

echo 🚀 3. Avvio dei server...
echo.

echo 📡 Avvio Backend Server (porta 5000)...
start "Backend Server" cmd /k "cd /d %CD% && node index.js"

timeout /t 3 /nobreak > nul

echo 🌐 Avvio Frontend Server (porta 5176)...
cd ..\frontend
start "Frontend Server" cmd /k "cd /d %CD% && npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo    ✅ ALLOGGI FINDER AVVIATO
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:5176
echo 📡 Backend:  http://localhost:5000
echo.
echo 💡 Premi un tasto per aprire il browser...
pause >nul

start http://localhost:5176

echo.
echo 🎉 AlloggiFinder è ora disponibile!
echo Chiudi questa finestra quando hai finito.
echo.
pause
