# PowerShell script to diagnose and fix API connection issues
# Run this script: .\check-api-status.ps1

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   API CONNECTION DIAGNOSTIC TOOL    " -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a URL is accessible
function Test-Url {
    param($Url)
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        return @{
            Success = $true
            StatusCode = $response.StatusCode
            Message = "OK"
        }
    } catch {
        return @{
            Success = $false
            StatusCode = $_.Exception.Response.StatusCode.value__
            Message = $_.Exception.Message
        }
    }
}

# 1. Check .env.local file
Write-Host "1. Checking .env.local configuration..." -ForegroundColor Yellow
$envFile = ".\.env.local"

if (Test-Path $envFile) {
    Write-Host "   [OK] .env.local file exists" -ForegroundColor Green
    $content = Get-Content $envFile
    $baseUrl = ($content | Select-String "REACT_APP_API_BASE_URL").ToString().Split("=")[1]
    Write-Host "   Backend URL: $baseUrl" -ForegroundColor Cyan
} else {
    Write-Host "   [WARN] .env.local not found! Creating default..." -ForegroundColor Red
    $defaultContent = "REACT_APP_API_BASE_URL=https://localhost:7279"
    Set-Content -Path $envFile -Value $defaultContent
    Write-Host "   [OK] Created .env.local with default URL" -ForegroundColor Green
    $baseUrl = "https://localhost:7279"
}

Write-Host ""

# 2. Check if backend is running
Write-Host "2. Testing backend connection..." -ForegroundColor Yellow

$urls = @(
    "https://localhost:7279",
    "http://localhost:5215"
)

$backendOnline = $false
$workingUrl = ""

foreach ($url in $urls) {
    Write-Host "   Testing $url..." -ForegroundColor Gray
    
    $testEndpoint = "$url/api/coowner/profile"
    $result = Test-Url -Url $testEndpoint
    
    if ($result.Success -or $result.StatusCode -eq 401) {
        Write-Host "   [OK] Backend is running at $url (Status: $($result.StatusCode))" -ForegroundColor Green
        $backendOnline = $true
        $workingUrl = $url
        break
    } else {
        Write-Host "   [FAIL] Cannot connect to $url" -ForegroundColor Red
    }
}

if (-not $backendOnline) {
    Write-Host ""
    Write-Host "   [ERROR] Backend is not running!" -ForegroundColor Red
    Write-Host "   Please start the backend server:" -ForegroundColor Yellow
    Write-Host "     cd path\to\backend" -ForegroundColor Cyan
    Write-Host "     dotnet run" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "   [SUCCESS] Backend is online at: $workingUrl" -ForegroundColor Green
    
    # Update .env.local if needed
    if ($baseUrl -ne $workingUrl) {
        Write-Host "   [WARN] .env.local URL ($baseUrl) differs from working URL ($workingUrl)" -ForegroundColor Yellow
        Write-Host "   Do you want to update .env.local? (Y/N): " -ForegroundColor Yellow -NoNewline
        $response = Read-Host
        if ($response -eq "Y" -or $response -eq "y") {
            Set-Content -Path $envFile -Value "REACT_APP_API_BASE_URL=$workingUrl"
            Write-Host "   [OK] Updated .env.local with working URL" -ForegroundColor Green
            Write-Host "   [IMPORTANT] Please restart your dev server (npm start)" -ForegroundColor Yellow
        }
    }
}

Write-Host ""

# 3. Check for access token
Write-Host "3. Checking authentication status..." -ForegroundColor Yellow

# Note: Cannot directly check localStorage from PowerShell
# User needs to check in browser
Write-Host "   Please check in browser DevTools:" -ForegroundColor Cyan
Write-Host "   1. Press F12" -ForegroundColor Gray
Write-Host "   2. Go to Application/Storage -> Local Storage" -ForegroundColor Gray
Write-Host "   3. Look for 'accessToken' key" -ForegroundColor Gray
Write-Host ""
Write-Host "   Do you have 'accessToken' in localStorage? (Y/N): " -ForegroundColor Yellow -NoNewline
$hasToken = Read-Host

if ($hasToken -eq "N" -or $hasToken -eq "n") {
    Write-Host "   [WARN] No access token found" -ForegroundColor Red
    Write-Host "   Please login at: http://localhost:3000/login" -ForegroundColor Yellow
}

Write-Host ""

# 4. Summary and recommendations
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "            SUMMARY                   " -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

if ($backendOnline) {
    Write-Host "[SUCCESS] Backend is running" -ForegroundColor Green
    Write-Host "Working URL: $workingUrl" -ForegroundColor Cyan
} else {
    Write-Host "[FAIL] Backend is not running" -ForegroundColor Red
    Write-Host "Action: Start backend with 'dotnet run'" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Make sure backend is running" -ForegroundColor Gray
Write-Host "2. Verify .env.local has correct URL" -ForegroundColor Gray
Write-Host "3. Restart frontend dev server: npm start" -ForegroundColor Gray
Write-Host "4. Login at http://localhost:3000/login" -ForegroundColor Gray
Write-Host "5. Check dashboard for backend status banner" -ForegroundColor Gray
Write-Host ""

Write-Host "For detailed troubleshooting, see:" -ForegroundColor Cyan
Write-Host "  - FIX_API_ERRORS.md" -ForegroundColor Gray
Write-Host "  - TROUBLESHOOTING_GUIDE.md" -ForegroundColor Gray
Write-Host ""

Write-Host "Press any key to exit..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
