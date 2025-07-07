# Script di pulizia del workspace UniHomes
# Rimuove tutti i file di debug, test temporanei e documentazione non necessaria

Write-Host "🧹 Avvio pulizia del workspace UniHomes..." -ForegroundColor Green

# File essenziali da mantenere (pattern)
$keepPatterns = @(
    "package.json",
    "package-lock.json", 
    ".gitignore",
    "README.md",
    ".env",
    "*.js",
    "*.html",
    "*.css",
    "*.json",
    "*.config.js",
    "*.sqlite",
    "frontend/*",
    "server/*",
    ".git/*",
    ".vscode/*",
    "node_modules/*"
)

# File da rimuovere (specifici)
$filesToDelete = @(
    "ACTIVATE-ENHANCED.bat",
    "AUTENTICAZIONE-IMPLEMENTATA.md",
    "AVVIA-BACKEND.bat", 
    "AVVIA-SISTEMA-AUTH.bat",
    "AVVIA-TUTTO.bat",
    "AVVIA-UNI-HOME.bat",
    "AVVIO-COMPLETO.bat",
    "AVVIO-COMPLETO.ps1",
    "BUG-FIX-FINALE-SUCCESSO.bat",
    "BUG-FIX-FINALE-SUCCESSO.md",
    "BUG-FIX-REPORT-FINALE.md",
    "BUG-NAVIGAZIONE-RISOLTO-FINALE.md",
    "BUG-RISOLTO-SUCCESSO.md",
    "CHECKLIST-TEST-COMPLETO.md",
    "CITY-FIELD-BUG-RESOLVED-FINAL.md",
    "CITY-FIELD-BUG-RISOLTO-DEFINITIVO.md",
    "CLEANUP-UNI-HOME.bat",
    "create-test-oria.js",
    "debug-navigation.html",
    "DEBUG-PROVINCIA-IMPLEMENTATO-FINALE.md",
    "DEBUGGING_LOG.md",
    "DEMO-CSS.bat",
    "demo-css.html",
    "DIAGNOSI-MESSAGGI-BIANCHI.bat",
    "EMERGENCY-FRONTEND-FIX.bat",
    "FIX-CITTA-INDIRIZZO-RISOLTO.md",
    "fix-frontend.bat",
    "FIX-MESSAGGI-IMMAGINI-COMPLETO.md",
    "FIX-MESSAGGISTICA-RECIPIENT-ID.md",
    "FIX-PAGINA-BIANCA-MESSAGGI-DOCUMENTAZIONE.md",
    "FIXES-GEOCODING-MESSAGGI-DOCUMENTAZIONE.md",
    "GEOLOCALIZZAZIONE-PROVINCIA-IMPLEMENTATA.md",
    "MAPPA-CORRETTA-FINALE.md",
    "MAPPA-UNIVERSITA-RISOLTE.md",
    "NUOVE-FUNZIONALITA-IMPLEMENTATE.md",
    "open-browser.bat",
    "populate-test-data.js",
    "PROGETTO-COMPLETATO.md",
    "PULIZIA-COMPLETATA.txt",
    "README-NEW.md",
    "README-UNI-HOME.md",
    "restart-frontend.bat",
    "RIPRISTINA-VERSIONE-ORIGINALE.bat",
    "RIPRISTINO-COMPLETATO.md",
    "SISTEMA-AVANZATO.html",
    "SISTEMA-COMPLETATO.md",
    "SISTEMA-COMPLETO-DOCUMENTAZIONE.md",
    "START-ALLOGGI-FINDER.bat",
    "START-BACKEND-FIXED.bat",
    "start-backend.bat",
    "START-FRONTEND-QUICK.bat",
    "start-frontend.bat",
    "START-SERVERS.ps1",
    "START-SISTEMA-AVANZATO.bat",
    "START-TUTTO-COMPLETO.bat",
    "START-UNI-HOME-FIXED.bat",
    "START-UNI-HOME.bat",
    "STRUTTURA-FINALE.md",
    "SUCCESSO-FINALE.txt",
    "SYNC-DB-PROVINCIA.bat",
    "test-announcement-simple.ps1",
    "test-announcement.ps1",
    "test-api-detail.js",
    "test-create-announcement.js",
    "test-debug-mappa.html",
    "TEST-DEBUG-MESSAGGISTICA.bat",
    "TEST-DEBUG-PROVINCIA-FINALE.bat",
    "test-finale.js",
    "TEST-FIX-CITTA-INDIRIZZO.bat",
    "TEST-FIX-MESSAGGISTICA.bat",
    "TEST-FIX-PAGINA-MESSAGGI.bat",
    "TEST-FIXES-GEOCODING-MESSAGGI.bat",
    "TEST-FLUSSO-COMPLETO-FINALE.bat",
    "test-functionality.js",
    "test-funzionalita.html",
    "test-geocoding-direct.js",
    "test-geocoding-finale.ps1",
    "TEST-GEOCODING-PRECISO.bat",
    "test-geocoding-preciso.html",
    "TEST-GEOCODING-PRECISO.ps1",
    "TEST-GEOCODING-PROVINCIA.bat",
    "test-geocoding-variants.js",
    "TEST-MAPPA-CORRETTA.bat",
    "TEST-MAPPA-UNIVERSITA.bat",
    "test-mappa-zoom.html",
    "TEST-MESSAGGI-IMMAGINI-FIX.bat",
    "TEST-MESSAGGISTICA-COMPLETA.bat",
    "TEST-NUOVE-FUNZIONALITA.bat",
    "TEST-NUOVO-BACKEND.bat",
    "TEST-REGISTRAZIONE-NUOVA.bat",
    "TEST-SISTEMA-AUTH.html",
    "TEST-SISTEMA.bat",
    "TUTTI-I-BUG-RISOLTI-FINALE.md",
    "UNI-HOME-COMPLETATO.md",
    "VERIFICA-FINALE-SUCCESSO.md"
)

# File test da rimuovere dalla cartella server
$serverTestFiles = @(
    "server/envtest.js",
    "server/simple-test.js",
    "server/test-announcement.js",
    "server/test-api.js",
    "server/test-create-announcement.js",
    "server/test-fetch.js",
    "server/test-frontend-bug.js",
    "server/test-jwt.js"
)

# File test da rimuovere dalla cartella frontend
$frontendTestFiles = @(
    "frontend/test-direct.html"
)

$deletedCount = 0

# Rimuovi file dalla root
foreach ($file in $filesToDelete) {
    $fullPath = Join-Path (Get-Location) $file
    if (Test-Path $fullPath) {
        try {
            Remove-Item $fullPath -Force
            Write-Host "✅ Rimosso: $file" -ForegroundColor Yellow
            $deletedCount++
        }
        catch {
            Write-Host "❌ Errore rimuovendo $file : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Rimuovi file test dal server
foreach ($file in $serverTestFiles) {
    $fullPath = Join-Path (Get-Location) $file
    if (Test-Path $fullPath) {
        try {
            Remove-Item $fullPath -Force
            Write-Host "✅ Rimosso: $file" -ForegroundColor Yellow
            $deletedCount++
        }
        catch {
            Write-Host "❌ Errore rimuovendo $file : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Rimuovi file test dal frontend
foreach ($file in $frontendTestFiles) {
    $fullPath = Join-Path (Get-Location) $file
    if (Test-Path $fullPath) {
        try {
            Remove-Item $fullPath -Force
            Write-Host "✅ Rimosso: $file" -ForegroundColor Yellow
            $deletedCount++
        }
        catch {
            Write-Host "❌ Errore rimuovendo $file : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n🎉 Pulizia completata!" -ForegroundColor Green
Write-Host "📊 File rimossi: $deletedCount" -ForegroundColor Cyan

Write-Host "`n📁 Struttura finale mantenuta:" -ForegroundColor Blue
Write-Host "├── frontend/ (cartella React/Vite)" -ForegroundColor White
Write-Host "├── server/ (cartella Node.js/Express)" -ForegroundColor White  
Write-Host "├── .git/ (controllo versioni)" -ForegroundColor White
Write-Host "├── .vscode/ (configurazione VS Code)" -ForegroundColor White
Write-Host "├── node_modules/ (dipendenze root)" -ForegroundColor White
Write-Host "├── package.json (configurazione root)" -ForegroundColor White
Write-Host "└── README.md (documentazione principale)" -ForegroundColor White

Write-Host "`n💡 Il progetto è ora pulito e organizzato!" -ForegroundColor Green
