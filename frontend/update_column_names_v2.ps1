$mappings = @{
    "tenant_id"       = "id_lembaga"
    "kursus_id"       = "id_kursus"
    "pengguna_id"     = "id_pengguna"
    "progress_persen" = "persentase_kemajuan"
    "materi_id"       = "id_materi"
    "enrollment_id"   = "id_pendaftaran"
    "user_id"         = "id_pengguna"
    "action"          = "aksi"
    "resource_type"   = "tipe_sumber_daya"
    "resource_id"     = "id_sumber_daya"
    "details"         = "detail"
    "ip_address"      = "alamat_ip"
    "user_agent"      = "agen_pengguna"
    "created_at"      = "dibuat_pada"
    "updated_at"      = "diperbarui_pada"
}

$files = Get-ChildItem -Path "src" -Recurse -Include *.ts, *.tsx

foreach ($file in $files) {
    if ($file.Name -eq "database.types.ts") { continue }
    
    $content = Get-Content $file.FullName -Raw
    $changed = $false
    
    foreach ($old in $mappings.Keys) {
        $new = $mappings[$old]
        
        # We use regex to match word boundaries to avoid replacing parts of other words
        # but only inside quotes or as object property
        $pattern = "\b$old\b"
        if ($content -match $pattern) {
            $content = $content -replace $pattern, $new
            $changed = $true
        }
    }
    
    if ($changed) {
        $content | Set-Content $file.FullName -NoNewline
    }
}
