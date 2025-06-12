@echo off
echo.
echo ====================================
echo  🏠 AlloggiFinder - Avvio Completo
echo ====================================
echo.

echo ⚡ Installazione dipendenze...

cd /d "%~dp0"

echo.
echo 📦 Installazione dipendenze BACKEND...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Errore nell'installazione dipendenze backend
    pause
    exit /b %errorlevel%
)

echo.
echo 📦 Installazione dipendenze FRONTEND...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Errore nell'installazione dipendenze frontend
    pause
    exit /b %errorlevel%
)

echo.
echo 🗄️ Inizializzazione database...
cd ..\server
call node syncDatabase.js
if %errorlevel% neq 0 (
    echo ❌ Errore nell'inizializzazione database
    pause
    exit /b %errorlevel%
)

echo.
echo 🚀 Avvio server BACKEND...
start "Backend Server" cmd /k "cd /d %~dp0server && npm start"
timeout /t 3 /nobreak >nul

echo.
echo 🌐 Avvio server FRONTEND...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ✅ Sistema avviato con successo!
echo.
echo 📡 Backend: http://localhost:5000
echo 🌐 Frontend: http://localhost:5173
echo.
echo 💡 Accedi con:
echo    Username: mario.rossi
echo    Password: password123
echo.
echo 🔄 Premi un tasto per aprire il browser...
pause >nul
start "" "http://localhost:5173"

echo.
echo 📋 Servizi attivi:
echo - Backend in esecuzione su porta 5000
echo - Frontend in esecuzione su porta 5173
echo.
echo ⚠️  Chiudi questo terminale per fermare i servizi
pause
