@echo off
color 0E
title UNI Home - Pulizia File Obsoleti

echo.
echo ===============================================
echo    🧹 UNI HOME - PULIZIA FILE OBSOLETI 🧹
echo ===============================================
echo.
echo [INFO] Avvio pulizia file non necessari...
echo.

echo [CLEAN] Rimozione file di debug...
del /q "DEBUGGING_LOG.md" 2>nul
del /q "DEMO-CSS.bat" 2>nul
del /q "demo-css.html" 2>nul
del /q "TEST-SISTEMA-AUTH.html" 2>nul
del /q "TEST-SISTEMA.bat" 2>nul
del /q "SISTEMA-AVANZATO.html" 2>nul

echo [CLEAN] Rimozione script di avvio obsoleti...
del /q "ACTIVATE-ENHANCED.bat" 2>nul
del /q "AVVIA-BACKEND.bat" 2>nul
del /q "AVVIA-SISTEMA-AUTH.bat" 2>nul
del /q "AVVIA-TUTTO.bat" 2>nul
del /q "AVVIO-COMPLETO.bat" 2>nul
del /q "EMERGENCY-FRONTEND-FIX.bat" 2>nul
del /q "fix-frontend.bat" 2>nul
del /q "open-browser.bat" 2>nul
del /q "restart-frontend.bat" 2>nul
del /q "START-ALLOGGI-FINDER.bat" 2>nul
del /q "start-backend.bat" 2>nul
del /q "START-FRONTEND-QUICK.bat" 2>nul
del /q "start-frontend.bat" 2>nul
del /q "START-SERVERS.ps1" 2>nul
del /q "START-SISTEMA-AVANZATO.bat" 2>nul

echo [CLEAN] Rimozione documentazione obsoleta...
del /q "AUTENTICAZIONE-IMPLEMENTATA.md" 2>nul
del /q "PROGETTO-COMPLETATO.md" 2>nul
del /q "README-NEW.md" 2>nul
del /q "README.md" 2>nul
del /q "SISTEMA-COMPLETATO.md" 2>nul

echo [CLEAN] Rimozione file configurazione obsoleti...
del /q "package_scripts.json" 2>nul
del /q "email.env" 2>nul

echo [CLEAN] Pulizia frontend - rimozione App obsoleti...
del /q "frontend\src\App-complete.jsx" 2>nul
del /q "frontend\src\App-Debug.jsx" 2>nul
del /q "frontend\src\App-Emergency.jsx" 2>nul
del /q "frontend\src\App-enhanced.jsx" 2>nul
del /q "frontend\src\App-Fixed.jsx" 2>nul
del /q "frontend\src\App-inline-styles.jsx" 2>nul
del /q "frontend\src\App-minimal.jsx" 2>nul
del /q "frontend\src\App-simple.jsx" 2>nul
del /q "frontend\src\App-temp.jsx" 2>nul
del /q "frontend\src\App-test.jsx" 2>nul
del /q "frontend\src\App-UNIHome.jsx" 2>nul
del /q "frontend\src\App.jsx" 2>nul

echo [CLEAN] Pulizia frontend - rimozione main obsoleti...
del /q "frontend\src\main-backup.jsx" 2>nul
del /q "frontend\src\main-emergency.jsx" 2>nul
del /q "frontend\src\main-working.jsx" 2>nul
del /q "frontend\src\test-main.jsx" 2>nul

echo [CLEAN] Pulizia frontend - rimozione file pubblici di test...
del /q "frontend\public\css-test.html" 2>nul
del /q "frontend\public\debug-status.html" 2>nul
del /q "frontend\public\debug.html" 2>nul
del /q "frontend\public\react-manual-test.html" 2>nul
del /q "frontend\public\test-inline.html" 2>nul
del /q "frontend\public\test.html" 2>nul

echo.
echo ===============================================
echo    ✅ PULIZIA COMPLETATA CON SUCCESSO! ✅
echo ===============================================
echo.
echo [INFO] File rimossi con successo!
echo [INFO] Progetto UNI Home ora pulito e ottimizzato
echo.
echo File essenziali mantenuti:
echo   📁 frontend/src/App-UNIHome-Fixed.jsx (App principale)
echo   📁 frontend/src/main.jsx (Entry point)
echo   📁 frontend/src/pages/UNIHomeAuthPage.jsx (Autenticazione)
echo   📁 server/index.js (Backend)
echo   🚀 START-UNI-HOME.bat (Script avvio)
echo   📖 README-UNI-HOME.md (Documentazione)
echo   📋 UNI-HOME-COMPLETATO.md (Status progetto)
echo.
pause
