# Update all references from guercif to kenitra in .tsx files
$files = Get-ChildItem "C:\Users\sofia\Desktop\kenitraarchiveweather\src" -Recurse -Filter "*.tsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Update route paths
    $content = $content -replace '/guercif"', '/kenitra"'
    $content = $content -replace "/guercif'", "/kenitra'"
    $content = $content -replace '/guercif`', '/kenitra`'
    $content = $content -replace 'guercif_weather', 'kenitra_weather'
    
    # Update text references (case-insensitive for common words)
    $content = $content -replace 'Guercif', 'Kénitra'
    $content = $content -replace 'guercif', 'kenitra'
    $content = $content -replace 'guercifi', 'kenitrien'
    $content = $content -replace 'guercifienne', 'kenitrienne'
    
    if ($content -ne $original) {
        Set-Content $file.FullName $content -Encoding UTF8
        Write-Host "Updated $($file.Name)"
    }
}

Write-Host "All .tsx files updated"