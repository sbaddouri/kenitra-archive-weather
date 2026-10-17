# Rename files to remove special characters
Rename-Item "C:\Users\sofia\Desktop\kenitraarchiveweather\plage et spectre de température.json" -NewName "plage-spectre-temperature.json" -Force
Rename-Item "C:\Users\sofia\Desktop\kenitraarchiveweather\plage de précipitation.json" -NewName "plage-precipitation.json" -Force
Write-Host "Files renamed"