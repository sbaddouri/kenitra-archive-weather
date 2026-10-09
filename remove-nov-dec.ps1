$dailyPath = "C:\Users\sofia\Desktop\kenitraarchiveweather\data\daily"
$hourlyPath = "C:\Users\sofia\Desktop\kenitraarchiveweather\data\hourly"

# Remove Nov and Dec 2026
Remove-Item (Join-Path $dailyPath "2026\11") -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item (Join-Path $dailyPath "2026\12") -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item (Join-Path $hourlyPath "2026\11") -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item (Join-Path $hourlyPath "2026\12") -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Removed Nov/Dec 2026 directories"