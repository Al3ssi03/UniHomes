@echo off
echo === DEBUG MESSAGGISTICA ===
echo.

echo 🔍 Verifico route messaggistica backend...
echo.

cd server

echo 📋 Route disponibili per messaggi:
echo - GET /api/messages/conversations
echo - GET /api/messages/conversation/:partnerId  
echo - POST /api/messages/send
echo - POST /api/messages (compatibilità frontend)
echo - PUT /api/messages/:messageId/read
echo - DELETE /api/messages/:messageId
echo.

echo 🌐 Test POST /api/messages (route chiamata dal frontend):
curl -X POST http://localhost:5000/api/messages ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer FAKE_TOKEN_FOR_TEST" ^
  -d "{\"recipientId\":1,\"content\":\"Test messaggio\",\"announcementId\":1}"

echo.
echo 🌐 Test route inesistente per confermare errore:
curl -X POST http://localhost:5000/api/messages/wrong ^
  -H "Content-Type: application/json"

echo.
echo 📊 Verifica che il server sia in ascolto:
curl -X GET http://localhost:5000/health 2>nul || echo ❌ Server non raggiungibile

echo.
pause
