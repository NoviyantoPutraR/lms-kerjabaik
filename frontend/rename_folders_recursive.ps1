$basePath = "d:\kerjabaik.ai\ACADEMY\frontend\src"

# Rename 'components' to 'komponen'
Get-ChildItem -Path $basePath -Recurse -Directory -Filter "components" | ForEach-Object {
    $parent = Split-Path $_.FullName -Parent
    $newName = Join-Path $parent "komponen"
    if (!(Test-Path $newName)) {
        Rename-Item -Path $_.FullName -NewName "komponen"
        Write-Host "Renamed $($_.FullName) to komponen"
    }
}

# Rename 'types' to 'tipe'
Get-ChildItem -Path $basePath -Recurse -Directory -Filter "types" | ForEach-Object {
    $parent = Split-Path $_.FullName -Parent
    $newName = Join-Path $parent "tipe"
    if (!(Test-Path $newName)) {
        Rename-Item -Path $_.FullName -NewName "tipe"
        Write-Host "Renamed $($_.FullName) to tipe"
    }
}
