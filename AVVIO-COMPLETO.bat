@echo off
echo ========================================
echo AVVIO COMPLETO SISTEMA UNI HOME
echo ========================================
echo.
echo 🚀 Avvio di tutti i servizi necessari...
echo.

echo 1️⃣ Avvio Backend (Server Node.js)...
cd /d "c:\Users\AlessioAndriulo\Music\UniHomes\server"
start "UNI Home Backend" cmd /k "node index.js"
echo ✅ Backend avviato su http://localhost:5000
echo.

echo 2️⃣ Avvio Frontend (Vite React)...
cd /d "c:\Users\AlessioAndriulo\Music\UniHomes\frontend"
start "UNI Home Frontend" cmd /k "npm run dev"
echo ✅ Frontend avviato su http://localhost:5173
echo.

echo 3️⃣ Attendere che i servizi si avviino...
timeout /t 5 /nobreak >nul
echo.

echo 🌐 Apertura browser per test...
start http://localhost:5173
echo.

echo ========================================
echo ✅ SISTEMA UNI HOME AVVIATO COMPLETAMENTE
echo ========================================
echo.
echo 📊 STATO SERVIZI:
echo Backend:  http://localhost:5000  (Node.js + SQLite)
echo Frontend: http://localhost:5173  (React + Vite)
echo.
echo 🧪 PROSSIMI PASSI:
echo 1. Esegui TEST-FLUSSO-COMPLETO-FINALE.bat
echo 2. Segui tutti gli step del test
echo 3. Verifica che tutto funzioni
echo.
echo 💡 Se hai problemi:
echo - Controlla che le porte 5000 e 5173 siano libere
echo - Verifica console per errori
echo - Riavvia i servizi se necessario
echo.
echo Premi un tasto per uscire...
pause >nul
