$base = "C:\Users\sofia\Desktop\kenitraarchiveweather\src\app\climatologie"

# Rename directories from guercif to kenitra
Rename-Item (Join-Path $base "annee\[year]\guercif") -NewName "kenitra" -Force -ErrorAction SilentlyContinue
Rename-Item (Join-Path $base "mois\[year]\[month]\guercif") -NewName "kenitra" -Force -ErrorAction SilentlyContinue
Rename-Item (Join-Path $base "jour\[year]\[month]\[day]\guercif") -NewName "kenitra" -Force -ErrorAction SilentlyContinue

Write-Host "Renamed route directories"