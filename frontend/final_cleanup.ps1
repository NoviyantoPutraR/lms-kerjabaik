$mappings = @{
    'enrollment'      = 'pendaftaran_kursus'
    'audit_logs'      = 'log_audit'
    'progress'        = 'kemajuan_belajar'
    'tenant'          = 'lembaga'
    'tenant_id'       = 'id_lembaga'
    'kursus_id'       = 'id_kursus'
    'pengguna_id'     = 'id_pengguna'
    'progress_persen' = 'persentase_kemajuan'
    'materi_id'       = 'id_materi'
    'enrollment_id'   = 'id_pendaftaran'
    'user_id'         = 'id_pengguna'
    'action'          = 'aksi'
    'resource_type'   = 'tipe_sumber_daya'
    'resource_id'     = 'id_sumber_daya'
    'details'         = 'detail'
    'ip_address'      = 'alamat_ip'
    'user_agent'      = 'agen_pengguna'
    'full_name'       = 'nama_lengkap'
    'logo_url'        = 'url_logo'
    'instruktur_id'   = 'id_instruktur'
    'modul_id'        = 'id_modul'
    'asesmen_id'      = 'id_asesmen'
    'percobaan_id'    = 'id_percobaan'
    'soal_id'         = 'id_soal'
    'tugas_id'        = 'id_tugas'
    'passing_score'   = 'nilai_kelulusan'
    'thumbnail_url'   = 'url_gambar_mini'
    'foto_url'        = 'url_foto'
    'avatar_url'      = 'url_foto'
    'file_url'        = 'url_berkas'
}

$files = Get-ChildItem -Path "src" -Recurse -Include *.ts, *.tsx

foreach ($file in $files) {
    if ($file.Name -eq "database.types.ts") { continue }
    
    $content = Get-Content $file.FullName -Raw
    $changed = $false
    
    foreach ($old in $mappings.Keys) {
        $new = $mappings[$old]
        
        # Mencocokkan "lama", 'lama', atau `lama`
        $patterns = @(
            "`"$old`"",
            "'$old'",
            "``$old``"
        )
        
        foreach ($p in $patterns) {
            $newP = $p.Replace($old, $new)
            if ($content.Contains($p)) {
                $content = $content.Replace($p, $newP)
                $changed = $true
            }
        }
    }
    
    if ($changed) {
        $content | Set-Content $file.FullName -NoNewline
        Write-Host "Updated $($file.FullName)"
    }
}
