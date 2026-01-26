$mappings = @(
    @("enrollment", "pendaftaran_kursus"),
    @("audit_logs", "log_audit"),
    @("progress", "kemajuan_belajar"),
    @("tenant", "lembaga"),
    @("tenant_id", "id_lembaga"),
    @("kursus_id", "id_kursus"),
    @("pengguna_id", "id_pengguna"),
    @("progress_persen", "persentase_kemajuan"),
    @("materi_id", "id_materi"),
    @("enrollment_id", "id_pendaftaran"),
    @("user_id", "id_pengguna"),
    @("action", "aksi"),
    @("resource_type", "tipe_sumber_daya"),
    @("resource_id", "id_sumber_daya"),
    @("details", "detail"),
    @("ip_address", "alamat_ip"),
    @("user_agent", "agen_pengguna"),
    @("created_at", "dibuat_pada"),
    @("updated_at", "diperbarui_pada"),
    @("full_name", "nama_lengkap"),
    @("avatar_url", "url_avatar"),
    @("logo_url", "url_logo")
)

$files = Get-ChildItem -Path "src" -Recurse -Include *.ts, *.tsx

foreach ($file in $files) {
    if ($file.Name -eq "database.types.ts") { continue }
    
    $content = Get-Content $file.FullName -Raw
    $changed = $false
    
    foreach ($m in $mappings) {
        $old = $m[0]
        $new = $m[1]
        
        # We replace "old", 'old', `old`
        if ($content -match "['\"`]$old['\"`]") {
            $content = $content -replace "(['\"`])$old(['\"`])", "`$ { 1 }$new`$ { 2 }"
            $changed = $true
        }
    }
    
    if ($changed) {
        $content | Set-Content $file.FullName -NoNewline
    }
}
