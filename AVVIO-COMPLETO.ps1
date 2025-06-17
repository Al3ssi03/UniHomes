Write-Host "🏠 UniHomes - Riavvio Completo Sistema" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan

# Fermata dei processi esistenti (se presenti)
Write-Host "🛑 Fermata processi esistenti..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2

# Avvio del Backend
Write-Host "🚀 Avvio Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\HP 15-FA0005NL\Desktop\UniHomes\server'; npm start" -WindowStyle Normal

# Attesa per l'avvio del backend
Write-Host "⏳ Attesa avvio backend (5 secondi)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Avvio del Frontend
Write-Host "🌐 Avvio Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\HP 15-FA0005NL\Desktop\UniHomes\frontend'; npm run dev" -WindowStyle Normal

# Attesa per l'avvio del frontend
Write-Host "⏳ Attesa avvio frontend (5 secondi)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Apertura browser per test
Write-Host "🌐 Apertura browser per test..." -ForegroundColor Green
Start-Process "http://localhost:5174"

Write-Host "✅ Sistema avviato con successo!" -ForegroundColor Green
Write-Host "📡 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:5174" -ForegroundColor Cyan
Write-Host "📋 Test: http://localhost:5174/listings" -ForegroundColor Cyan

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🎯 PRONTO PER I TEST:" -ForegroundColor Green
Write-Host "1. Vai su http://localhost:5174/listings" -ForegroundColor White
Write-Host "2. Clicca 'Vedi Dettagli' su un annuncio" -ForegroundColor White
Write-Host "3. Vai su http://localhost:5174/publish per testare il form" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan
