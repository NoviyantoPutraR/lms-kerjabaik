$mappings = @{
    'from\("enrollment"\)' = 'from("pendaftaran_kursus")'
    "from\('enrollment'\)" = "from('pendaftaran_kursus')"
    'from\("audit_logs"\)' = 'from("log_audit")'
    "from\('audit_logs'\)" = "from('log_audit')"
    'from\("progress"\)'   = 'from("kemajuan_belajar")'
    "from\('progress'\)"   = "from('kemajuan_belajar')"
    'from\("tenant"\)'     = 'from("lembaga")'
    "from\('tenant'\)"     = "from('lembaga')"
    'from "../types"'      = 'from "../tipe/index"'
    "from '../types'"      = "from '../tipe/index'"
}

$files = Get-ChildItem -Path "src" -Recurse -Include *.ts, *.tsx

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $changed = $false
    
    foreach ($pattern in $mappings.Keys) {
        if ($content -match $pattern) {
            $content = $content -replace $pattern, $mappings[$pattern]
            $changed = $true
        }
    }
    
    if ($changed) {
        $content | Set-Content $file.FullName -NoNewline
    }
}
