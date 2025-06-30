@echo off
echo ==========================================
echo 🚀 AVVIO COMPLETO UNI HOME - FRONTEND + BACKEND
echo ==========================================

echo 🔄 Avvio del server backend...
echo 📌 Aprendo una nuova finestra per il backend...
start "Backend Server" cmd /k "cd server && echo 🚀 Avvio backend server... && node index.js"

echo.
echo ⏳ Attendo 3 secondi per l'avvio del backend...
timeout /t 3 /nobreak > nul

echo.
echo 🔄 Avvio del frontend...
echo 📌 Aprendo una nuova finestra per il frontend...
start "Frontend Server" cmd /k "cd frontend && echo 🚀 Avvio frontend server... && npm run dev"

echo.
echo ✅ Entrambi i server dovrebbero essere in avvio...
echo 📌 Backend: http://localhost:5000
echo 📌 Frontend: http://localhost:5173
echo.
echo 🌐 Apertura browser...
timeout /t 5 /nobreak > nul
start http://localhost:5173

echo.
echo ℹ️  Per fermare i server, chiudi le finestre del terminale oppure premi Ctrl+C in ciascuna finestra.
echo.
pause
