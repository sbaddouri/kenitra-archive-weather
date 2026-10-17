# Copy files with clean names (avoid encoding issues)
$src1 = "C:\Users\sofia\Desktop\kenitraarchiveweather\plage et spectre de température.json"
$src2 = "C:\Users\sofia\Desktop\kenitraarchiveweather\plage de précipitation.json"

$dst1 = "C:\Users\sofia\Desktop\kenitraarchiveweather\plage-spectre-temperature.json"
$dst2 = "C:\Users\sofia\Desktop\kenitraarchiveweather\plage-precipitation.json"

# Try multiple encodings
$files = Get-ChildItem "C:\Users\sofia\Desktop\kenitraarchiveweather" -Filter "plage*"
foreach ($file in $files) {
    if ($file.Name -like "*spectre*") {
        Copy-Item $file.FullName $dst1 -Force
        Write-Host "Copied: $($file.Name) -> plage-spectre-temperature.json"
    }
    if ($file.Name -like "*precipitation*") {
        Copy-Item $file.FullName $dst2 -Force
        Write-Host "Copied: $($file.Name) -> plage-precipitation.json"
    }
}