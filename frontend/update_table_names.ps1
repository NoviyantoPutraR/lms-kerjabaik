$mappings = @{
    '.from("audit_logs")' = '.from("log_audit")'
    '.from("enrollment")' = '.from("pendaftaran_kursus")'
    '.from("progress")'   = '.from("kemajuan_belajar")'
    '.from("tenant")'     = '.from("lembaga")'
}

$files = Get-ChildItem -Path "src" -Recurse -Include *.ts, *.tsx

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $changed = $false
    
    foreach ($old in $mappings.Keys) {
        if ($content.Contains($old)) {
            $content = $content.Replace($old, $mappings[$old])
            $changed = $true
        }
    }
    
    if ($changed) {
        $content | Set-Content $file.FullName -NoNewline
    }
}
