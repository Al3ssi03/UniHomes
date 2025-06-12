@echo off
echo.
echo ====================================
echo  🚀 AlloggiFinder - Enhanced Version
echo ====================================
echo.

echo 🔄 Switching to enhanced version...

cd /d "%~dp0frontend\src"

echo 📝 Creating backup of current main.jsx...
copy main.jsx main-backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%.jsx

echo ✨ Activating enhanced features...
echo import React from "react"; > main.jsx
echo import ReactDOM from "react-dom/client"; >> main.jsx
echo import App from "./App-enhanced.jsx"; >> main.jsx
echo import "./index.css"; >> main.jsx
echo. >> main.jsx
echo console.log("🚀 AlloggiFinder Enhanced - Starting..."); >> main.jsx
echo. >> main.jsx
echo const rootElement = document.getElementById("root"); >> main.jsx
echo if (rootElement) { >> main.jsx
echo     const root = ReactDOM.createRoot(rootElement); >> main.jsx
echo     root.render( >> main.jsx
echo         ^<React.StrictMode^> >> main.jsx
echo             ^<App /^> >> main.jsx
echo         ^</React.StrictMode^> >> main.jsx
echo     ); >> main.jsx
echo     console.log("✅ Enhanced AlloggiFinder loaded successfully"); >> main.jsx
echo } >> main.jsx

cd /d "%~dp0"

echo ✅ Enhanced version activated!
echo.
echo 🌟 New features available:
echo    - Advanced search with autocomplete
echo    - Enhanced filters with price range slider  
echo    - Statistics dashboard
echo    - Notification center
echo    - Improved UI components
echo.
echo 🔗 Access your enhanced app at: http://localhost:5173
echo.
echo 📚 To revert to previous version:
echo    1. Stop the frontend server
echo    2. Restore main.jsx from backup
echo    3. Restart the server
echo.
pause
