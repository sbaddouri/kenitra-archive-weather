# Clean up Open-Meteo data files, keeping empty directory structure from Jan 1940 to Oct 2026

$basePath = "C:\Users\sofia\Desktop\kenitraarchiveweather\data"

# Delete all JSON files in daily directory
$dailyPath = Join-Path $basePath "daily"
if (Test-Path $dailyPath) {
    $jsonFiles = Get-ChildItem -Path $dailyPath -Recurse -Filter "*.json" -File
    foreach ($file in $jsonFiles) {
        Remove-Item $file.FullName -Force
    }
    Write-Host "Deleted $($jsonFiles.Count) JSON files from daily directory"
}

# Delete all JSON files in hourly directory
$hourlyPath = Join-Path $basePath "hourly"
if (Test-Path $hourlyPath) {
    $jsonFiles = Get-ChildItem -Path $hourlyPath -Recurse -Filter "*.json" -File
    foreach ($file in $jsonFiles) {
        Remove-Item $file.FullName -Force
    }
    Write-Host "Deleted $($jsonFiles.Count) JSON files from hourly directory"
}

# Delete all JSON files in monthly directory (if any)
$monthlyPath = Join-Path $basePath "monthly"
if (Test-Path $monthlyPath) {
    $jsonFiles = Get-ChildItem -Path $monthlyPath -Recurse -Filter "*.json" -File
    foreach ($file in $jsonFiles) {
        Remove-Item $file.FullName -Force
    }
    Write-Host "Deleted $($jsonFiles.Count) JSON files from monthly directory"
}

# Delete all JSON files in yearly directory (if any)
$yearlyPath = Join-Path $basePath "yearly"
if (Test-Path $yearlyPath) {
    $jsonFiles = Get-ChildItem -Path $yearlyPath -Recurse -Filter "*.json" -File
    foreach ($file in $jsonFiles) {
        Remove-Item $file.FullName -Force
    }
    Write-Host "Deleted $($jsonFiles.Count) JSON files from yearly directory"
}

# Reset last-update-status.json to empty state
$statusPath = Join-Path $basePath "last-update-status.json"
$emptyStatus = @{
    success = $false
    date = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
    message = "Données réinitialisées - structure vide prête pour Kénitra"
    initialStartDate = "1940-01-01"
    initialEndDate = "2026-10-31"
    finalStartDate = ""
    finalEndDate = ""
    attempts = 0
    daysUpdated = @()
    missingDays = @()
    attemptDetails = @()
} | ConvertTo-Json -Depth 5

Set-Content -Path $statusPath -Value $emptyStatus -Encoding UTF8
Write-Host "Reset last-update-status.json"

# Remove years beyond 2026 (2027) from daily and hourly
$yearsToRemove = @("2027")
foreach ($year in $yearsToRemove) {
    $dailyYearPath = Join-Path $dailyPath $year
    $hourlyYearPath = Join-Path $hourlyPath $year
    if (Test-Path $dailyYearPath) {
        Remove-Item $dailyYearPath -Recurse -Force
        Write-Host "Removed daily/$year (beyond 2026)"
    }
    if (Test-Path $hourlyYearPath) {
        Remove-Item $hourlyYearPath -Recurse -Force
        Write-Host "Removed hourly/$year (beyond 2026)"
    }
}

# Remove months beyond October 2026 (Nov, Dec 2026)
$monthsToRemove2026 = @("11", "12")
foreach ($month in $monthsToRemove2026) {
    $dailyMonthPath = Join-Path $dailyPath "2026" $month
    $hourlyMonthPath = Join-Path $hourlyPath "2026" $month
    if (Test-Path $dailyMonthPath) {
        Remove-Item $dailyMonthPath -Recurse -Force
        Write-Host "Removed daily/2026/$month (beyond Oct 2026)"
    }
    if (Test-Path $hourlyMonthPath) {
        Remove-Item $hourlyMonthPath -Recurse -Force
        Write-Host "Removed hourly/2026/$month (beyond Oct 2026)"
    }
}

Write-Host "Data cleanup complete! Empty directory structure preserved from Jan 1940 to Oct 2026."