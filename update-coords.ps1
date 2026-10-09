$KENITRA_LAT = '34.300616413859444'
$KENITRA_LON = '-6.599642231879808'

# Update fetch-weather.ts
$content = Get-Content 'C:\Users\sofia\Desktop\kenitraarchiveweather\scripts\fetch-weather.ts' -Raw
$content = $content -replace 'const LAT = 34\.2257;', "const LAT = $KENITRA_LAT;"
$content = $content -replace 'const LON = -3\.3536;', "const LON = $KENITRA_LON;"
Set-Content 'C:\Users\sofia\Desktop\kenitraarchiveweather\scripts\fetch-weather.ts' $content
Write-Host 'Updated fetch-weather.ts'

# Update all fetch-year-*.ts files
$yearFiles = Get-ChildItem 'C:\Users\sofia\Desktop\kenitraarchiveweather\scripts\fetch-year-*.ts'
foreach ($file in $yearFiles) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace 'const LAT = 34\.2257;', "const LAT = $KENITRA_LAT;"
    $content = $content -replace 'const LON = -3\.3536;', "const LON = $KENITRA_LON;"
    Set-Content $file.FullName $content
    Write-Host "Updated $($file.Name)"
}

# Update other fetch scripts
$otherFiles = @('fetch-2026-jan-sept.ts', 'test-2000-api.ts', 'test-api-availability.ts')
foreach ($file in $otherFiles) {
    $filePath = "C:\Users\sofia\Desktop\kenitraarchiveweather\scripts\$file"
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        $content = $content -replace 'const LAT = 34\.2257;', "const LAT = $KENITRA_LAT;"
        $content = $content -replace 'const LON = -3\.3536;', "const LON = $KENITRA_LON;"
        Set-Content $filePath $content
        Write-Host "Updated $file"
    }
}

# Update verify scripts
$verifyFiles = Get-ChildItem 'C:\Users\sofia\Desktop\kenitraarchiveweather\scripts\verify-*.ts'
foreach ($file in $verifyFiles) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace 'const LAT = 34\.2257;', "const LAT = $KENITRA_LAT;"
    $content = $content -replace 'const LON = -3\.3536;', "const LON = $KENITRA_LON;"
    Set-Content $file.FullName $content
    Write-Host "Updated $($file.Name)"
}

Write-Host 'All coordinate updates complete!'