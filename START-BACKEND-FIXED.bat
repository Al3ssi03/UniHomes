@echo off
echo ==========================================
echo 🚀 AVVIO UNI HOME BACKEND SERVER
echo ==========================================

cd server
echo 📁 Directory: %cd%

echo 🔍 Verifica file principali...
if exist "index.js" (
    echo ✅ index.js trovato
) else (
    echo ❌ index.js NON trovato
    pause
    exit /b 1
)

if exist "package.json" (
    echo ✅ package.json trovato
) else (
    echo ❌ package.json NON trovato
    pause
    exit /b 1
)

echo.
echo 🔄 Avvio server backend...
echo 📌 URL API: http://localhost:5000
echo 📌 Per interrompere: Ctrl+C
echo.

node index.js

pause
