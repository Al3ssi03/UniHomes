# Simple test for announcement creation
Write-Host "Testing announcement creation API..."

# First test login
$loginData = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Login successful, token received"
    
    # Test announcement creation with correct field names
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $announcementData = @{
        titolo = "Test Announcement"
        descrizione = "Test description"
        prezzo = "500"
        citta = "Milano"
        indirizzo = "Via Roma 1"
        lat = "45.4642"
        lng = "9.1900"
    } | ConvertTo-Json
    
    Write-Host "Sending announcement data with citta field..."
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/announcements" -Method POST -Body $announcementData -Headers $headers
    Write-Host "Success! Announcement created:" $response.message
    
} catch {
    Write-Host "Error occurred:"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body:" $responseBody
    }
}
