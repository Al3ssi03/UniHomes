@echo off
cls
echo ============================================
echo    🚀 AlloggiFinder - Sistema Avanzato
echo ============================================
echo.

echo 🔵 Verifica stato servers...

:: Check if backend is running
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/test' -TimeoutSec 5; Write-Host '✅ Backend attivo su porta 5000' -ForegroundColor Green } catch { Write-Host '❌ Backend non disponibile' -ForegroundColor Red }"

:: Check if frontend is running  
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5173' -TimeoutSec 5; Write-Host '✅ Frontend attivo su porta 5173' -ForegroundColor Green } catch { Write-Host '❌ Frontend non disponibile' -ForegroundColor Red }"

echo.
echo 🌐 Apertura interfacce...

:: Open the enhanced system overview
start "" "SISTEMA-AVANZATO.html"

timeout /t 2 /nobreak >nul

:: Open the main frontend
start "" "http://localhost:5173"

timeout /t 2 /nobreak >nul

:: Open the enhanced listings page
start "" "http://localhost:5173/listings"

timeout /t 2 /nobreak >nul

:: Open the demo components page
start "" "http://localhost:5173/demo-components"

echo.
echo ✅ Sistema Avanzato AlloggiFinder avviato!
echo.
echo 📋 Interfacce aperte:
echo    🏠 Sistema Overview:    SISTEMA-AVANZATO.html
echo    🚀 Frontend:           http://localhost:5173
echo    🔍 Enhanced Listings:  http://localhost:5173/listings  
echo    🧪 Demo Componenti:    http://localhost:5173/demo-components
echo    📡 Backend API:        http://localhost:5000/api/info
echo.
pause
