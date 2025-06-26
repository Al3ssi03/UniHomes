Write-Host "🎯 Test Finale - Geocoding Intelligente" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan

Write-Host "`n📍 Verifica annuncio esistente..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/announcements/1" -Method Get
    Write-Host "✅ Annuncio trovato:" -ForegroundColor Green
    Write-Host "   Titolo: $($response.titolo)" -ForegroundColor White
    Write-Host "   Indirizzo: $($response.indirizzo)" -ForegroundColor White
    Write-Host "   Città: $($response.citta)" -ForegroundColor White
    Write-Host "   Provincia: $($response.provincia)" -ForegroundColor White
} catch {
    Write-Host "❌ Errore nel caricamento annuncio" -ForegroundColor Red
}

Write-Host "`n🗺️ Aprendo pagina dettagli per test..." -ForegroundColor Yellow
Start-Process "http://localhost:5174/annuncio/1"

Write-Host "`n🎯 RISULTATI ATTESI:" -ForegroundColor Cyan
Write-Host "1. La mappa dovrebbe provare diverse varianti:" -ForegroundColor White
Write-Host "   - Via Filippo Brunelleschi, Oria, BR, Italia" -ForegroundColor Gray
Write-Host "   - Via Filippo Brunelleschi, Oria, Brindisi, Italia" -ForegroundColor Gray
Write-Host "   - Via Brunelleschi, Oria, Brindisi, Italia ← QUESTA DOVREBBE FUNZIONARE" -ForegroundColor Green
Write-Host "   - Brunelleschi, Oria, Brindisi, Italia" -ForegroundColor Gray

Write-Host "`n📍 Coordinate attese per Via Brunelleschi:" -ForegroundColor Cyan
Write-Host "   Lat: 40.4943926" -ForegroundColor Yellow
Write-Host "   Lng: 17.6529411" -ForegroundColor Yellow

Write-Host "`n🔍 COME VERIFICARE:" -ForegroundColor Green
Write-Host "1. Apri la console del browser (F12)" -ForegroundColor White
Write-Host "2. Ricarica la pagina" -ForegroundColor White
Write-Host "3. Cerca i log che iniziano con 🗺️ e 🔍" -ForegroundColor White
Write-Host "4. Verifica che usi le coordinate precise invece del centro città" -ForegroundColor White

Write-Host "`n✅ Test avviato!" -ForegroundColor Green
