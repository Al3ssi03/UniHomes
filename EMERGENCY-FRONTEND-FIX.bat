@echo off
echo.
echo ========================================
echo     🚨 DIAGNOSTICA EMERGENZA FRONTEND
echo ========================================
echo.

cd /d "c:\Users\AlessioAndriulo\Music\UniHomes\frontend"

echo 🔍 1. Controllo stato corrente...
echo Directory: %CD%
echo.

echo 🔍 2. Controllo processi Node.js...
tasklist /FI "IMAGENAME eq node.exe" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Processi Node trovati
) else (
    echo ❌ Nessun processo Node trovato
)
echo.

echo 🔍 3. Controllo porte in uso...
netstat -an | findstr ":5176" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Porta 5176 in uso
) else (
    echo ❌ Porta 5176 libera
)
echo.

echo 🔍 4. Controllo file critici...
if exist "src\main.jsx" (
    echo ✅ main.jsx trovato
) else (
    echo ❌ main.jsx mancante
)

if exist "src\main-emergency.jsx" (
    echo ✅ main-emergency.jsx trovato
) else (
    echo ❌ main-emergency.jsx mancante
)

if exist "index.html" (
    echo ✅ index.html trovato
) else (
    echo ❌ index.html mancante
)
echo.

echo 🔍 5. Controllo node_modules...
if exist "node_modules" (
    echo ✅ node_modules presente
    if exist "node_modules\react" (
        echo ✅ React installato
    ) else (
        echo ❌ React mancante
    )
) else (
    echo ❌ node_modules mancante
)
echo.

echo 🚀 6. PULIZIA E RIAVVIO COMPLETO...
echo.

echo 🛑 Fermando tutti i processi Node...
taskkill /f /im node.exe 2>nul

echo 🧹 Pulizia cache...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite" 2>nul
if exist "dist" rmdir /s /q "dist" 2>nul

echo 📦 Reinstallazione dipendenze...
call npm install --force

echo 🚀 Avvio server con modalità verbose...
echo.
echo ========================================
echo   🌐 Server disponibile su:
echo   http://localhost:5176
echo ========================================
echo.

start http://localhost:5176
call npm run dev -- --host 0.0.0.0 --port 5176

pause
