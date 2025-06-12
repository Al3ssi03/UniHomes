# PowerShell script to start both servers
Write-Host "🚀 AlloggiFinder - Starting Servers..." -ForegroundColor Green

# Function to test if port is available
function Test-Port {
    param($Port)
    try {
        $tcpConnection = New-Object System.Net.Sockets.TcpClient
        $tcpConnection.Connect("localhost", $Port)
        $tcpConnection.Close()
        return $true
    } catch {
        return $false
    }
}

# Check if backend is already running
if (Test-Port 5000) {
    Write-Host "⚠️  Backend already running on port 5000" -ForegroundColor Yellow
} else {
    Write-Host "🔵 Starting backend server..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\AlessioAndriulo\Music\UniHomes\server'; node index.js"
    Start-Sleep -Seconds 3
}

# Check if frontend is already running
if (Test-Port 5173) {
    Write-Host "⚠️  Frontend already running on port 5173" -ForegroundColor Yellow
} else {
    Write-Host "🔵 Starting frontend server..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\AlessioAndriulo\Music\UniHomes\frontend'; npm run dev"
    Start-Sleep -Seconds 3
}

Write-Host ""
Write-Host "✅ Servers started!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "📡 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📋 Backend Info: http://localhost:5000/api/info" -ForegroundColor Cyan

# Wait for servers to start then open browser
Start-Sleep -Seconds 5
Start-Process "http://localhost:5173"

Read-Host "Press Enter to continue..."
