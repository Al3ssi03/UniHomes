@echo off
echo 🔧 Fixing AlloggiFinder Frontend - React Version Issue
echo.
cd /d "c:\Users\AlessioAndriulo\Music\UniHomes\frontend"
echo Current directory: %CD%
echo.

echo 1. Removing node_modules and package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist .vite rmdir /s /q .vite
echo ✅ Cleanup complete
echo.

echo 2. Installing React 18 and dependencies...
call npm install
echo ✅ Dependencies installed
echo.

echo 3. Starting development server...
echo 🚀 Server will start on http://localhost:5176
echo Press Ctrl+C to stop the server
echo.
call npm run dev
