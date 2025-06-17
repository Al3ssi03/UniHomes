# PowerShell script per testare la creazione di annunci

$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFyaW8ucm9zc2kiLCJpYXQiOjE3NDk4OTcxMTcsImV4cCI6MTc1MDUwMTkxN30.SefL3VXtzzCj7T7BkX8"

# Crea FormData manualmente
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$bodyLines = @(
    "--$boundary",
    'Content-Disposition: form-data; name="titolo"',
    "",
    "Test Annuncio PowerShell",
    "--$boundary",
    'Content-Disposition: form-data; name="descrizione"',
    "",
    "Test per verificare il campo citta",
    "--$boundary",
    'Content-Disposition: form-data; name="prezzo"',
    "",
    "650",
    "--$boundary",
    'Content-Disposition: form-data; name="citta"',
    "",
    "Roma",
    "--$boundary",
    'Content-Disposition: form-data; name="indirizzo"',
    "",
    "Via del Test 123",
    "--$boundary--"
)

$body = $bodyLines -join $LF

Write-Host "📋 Body da inviare:"
Write-Host $body

Write-Host "📡 Invio richiesta..."

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/announcements" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "multipart/form-data; boundary=$boundary"
    } -Body $body

    Write-Host "✅ Successo!"
    Write-Host "📊 Status: $($response.StatusCode)"
    Write-Host "📋 Content:"
    Write-Host $response.Content
} catch {
    Write-Host "❌ Errore:"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "📋 Response Body:"
        Write-Host $responseBody
    }
}
