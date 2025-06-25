@echo off
echo === TEST REGISTRAZIONE CON NUOVI CAMPI ===
echo.

echo 🌐 Test registrazione con nuovi campi:
echo - Email
echo - Città
echo - Provincia  
echo - Professione
echo - Biografia
echo.

cd server

curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser_new\",\"email\":\"test@newuser.com\",\"password\":\"password123\",\"nome\":\"Mario\",\"cognome\":\"Rossi\",\"telefono\":\"3331234567\",\"citta\":\"Roma\",\"provincia\":\"RM\",\"professione\":\"Studente\",\"biografia\":\"Studente universitario alla ricerca di alloggio vicino alla Sapienza\"}"

echo.
echo 📝 Test login per verificare che tutti i dati siano salvati...

curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser_new\",\"password\":\"password123\"}"

echo.
echo ✅ Test completato!
pause
