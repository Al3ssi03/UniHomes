Write-Host "🗺️ Test Correzione Geocoding Precisione" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

Write-Host "📍 Test 1: Verifica annuncio esistente" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/announcements/1" -Method Get
    Write-Host "✅ Annuncio trovato:" -ForegroundColor Green
    Write-Host "   Titolo: $($response.titolo)" -ForegroundColor White
    Write-Host "   Città: $($response.citta)" -ForegroundColor White
    Write-Host "   Provincia: $($response.provincia)" -ForegroundColor White
    Write-Host "   Indirizzo: $($response.indirizzo)" -ForegroundColor White
    
    $fullAddress = "$($response.indirizzo), $($response.citta), $($response.provincia), Italia"
    Write-Host "   Indirizzo completo: $fullAddress" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Errore: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🌐 Test 2: Apertura pagine per verifica" -ForegroundColor Yellow
Write-Host "Aprendo le pagine di test..." -ForegroundColor White

# Apri la pagina dettagli
Start-Process "http://localhost:5174/annuncio/1"
Start-Sleep -Seconds 2

# Apri la pagina di test geocoding
Start-Process "file:///c:/Users/HP%2015-FA0005NL/Desktop/UniHomes/test-geocoding-preciso.html"

Write-Host "`n🎯 ISTRUZIONI TEST:" -ForegroundColor Green
Write-Host "1. Nella pagina dettagli, verifica che la mappa mostri l'indirizzo preciso" -ForegroundColor White
Write-Host "2. Nella pagina test geocoding, prova i diversi formati di indirizzo" -ForegroundColor White
Write-Host "3. Confronta la precisione tra ricerca generica e specifica" -ForegroundColor White

Write-Host "`n📋 RISULTATO ATTESO:" -ForegroundColor Cyan
Write-Host "La mappa dovrebbe ora cercare:" -ForegroundColor White
Write-Host "  `"Via Filippo Brunelleschi, 31a, Oria, BR, Italia`"" -ForegroundColor Yellow
Write-Host "Invece di solo:" -ForegroundColor White
Write-Host "  `"Oria, BR, Italia`"" -ForegroundColor Red

Write-Host "`n✅ Test completato!" -ForegroundColor Green
