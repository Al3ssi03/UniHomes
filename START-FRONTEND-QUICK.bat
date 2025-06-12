@echo off
echo.
echo ====================================
echo  🚀 Avvio Rapido Frontend
echo ====================================
echo.

cd /d "%~dp0frontend"

echo 🔍 Verifica dipendenze...
if not exist "node_modules" (
    echo 📦 Installazione dipendenze...
    npm install
)

echo ✨ Verifica configurazione CSS...
findstr /C:"@tailwind" src\index.css >nul
if errorlevel 1 (
    echo ⚠️  Aggiunta direttive Tailwind...
    echo @tailwind base; > temp_css.txt
    echo @tailwind components; >> temp_css.txt
    echo @tailwind utilities; >> temp_css.txt
    echo. >> temp_css.txt
    type src\index.css >> temp_css.txt
    move temp_css.txt src\index.css
)

echo 🌐 Avvio server di sviluppo...
echo 📍 Frontend sarà disponibile su: http://localhost:5173
echo 🧪 Test CSS disponibile su: http://localhost:5173/css-test.html
echo.

start "Frontend AlloggiFinder" npm run dev

echo ✅ Frontend avviato!
echo.
echo 💡 Suggerimenti:
echo    - Se vedi errori CSS, visita: http://localhost:5173/css-test.html
echo    - Per riavviare, chiudi il terminale e rilancia questo script
echo.
pause
