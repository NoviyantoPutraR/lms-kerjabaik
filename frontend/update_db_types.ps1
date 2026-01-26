$mappings = @{
    'tenant:'          = 'lembaga:'
    'enrollment:'      = 'pendaftaran_kursus:'
    'progress:'        = 'kemajuan_belajar:'
    'audit_logs:'      = 'log_audit:'
    'created_at:'      = 'dibuat_pada:'
    'updated_at:'      = 'diperbarui_pada:'
    'tenant_id:'       = 'id_lembaga:'
    'kursus_id:'       = 'id_kursus:'
    'pengguna_id:'     = 'id_pengguna:'
    'progress_persen:' = 'persentase_kemajuan:'
    'materi_id:'       = 'id_materi:'
    'enrollment_id:'   = 'id_pendaftaran:'
    'user_id:'         = 'id_pengguna:'
    'action:'          = 'aksi:'
    'resource_type:'   = 'tipe_sumber_daya:'
    'resource_id:'     = 'id_sumber_daya:'
    'details:'         = 'detail:'
    'ip_address:'      = 'alamat_ip:'
    'user_agent:'      = 'agen_pengguna:'
    'full_name:'       = 'nama_lengkap:'
    'avatar_url:'      = 'url_avatar:'
    'logo_url:'        = 'url_logo:'
}

$file = "d:\kerjabaik.ai\ACADEMY\frontend\src\shared\tipe\database.types.ts"
$content = Get-Content $file -Raw

foreach ($old in $mappings.Keys) {
    if ($content.Contains($old)) {
        $content = $content.Replace($old, $mappings[$old])
    }
}

$content | Set-Content $file -NoNewline
