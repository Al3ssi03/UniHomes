@echo off
echo Starting UniHomes Frontend Development Server...
cd /d "c:\Users\AlessioAndriulo\Music\UniHomes\frontend"
echo Current directory: %CD%
echo.
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting Vite development server...
call npm run dev
pause
