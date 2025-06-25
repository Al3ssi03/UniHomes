@echo off
echo ==========================================
echo 🚀 AVVIO UNI HOME FRONTEND - VERSIONE SEMPLIFICATA
echo ==========================================

cd frontend
echo 📁 Directory: %cd%

echo 🔍 Verifica file principali...
if exist "package.json" (
    echo ✅ package.json trovato
) else (
    echo ❌ package.json NON trovato
    pause
    exit /b 1
)

if exist "src\main.jsx" (
    echo ✅ main.jsx trovato
) else (
    echo ❌ main.jsx NON trovato
    pause
    exit /b 1
)

if exist "src\App-Simple-Working.jsx" (
    echo ✅ App-Simple-Working.jsx trovato
) else (
    echo ❌ App-Simple-Working.jsx NON trovato
    pause
    exit /b 1
)

echo.
echo 🔄 Avvio server di sviluppo...
echo 📌 URL: http://localhost:5173
echo 📌 Per interrompere: Ctrl+C
echo.

npm run dev

pause
