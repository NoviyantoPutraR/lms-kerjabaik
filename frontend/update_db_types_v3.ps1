$mappings = @(
    @{ old = 'progress_persen:'; new = 'persentase_kemajuan:' },
    @{ old = 'enrollment_id:'; new = 'id_pendaftaran:' },
    @{ old = 'tenant_id:'; new = 'id_lembaga:' },
    @{ old = 'kursus_id:'; new = 'id_kursus:' },
    @{ old = 'pengguna_id:'; new = 'id_pengguna:' },
    @{ old = 'materi_id:'; new = 'id_materi:' },
    @{ old = 'user_id:'; new = 'id_pengguna:' },
    @{ old = 'resource_type:'; new = 'tipe_sumber_daya:' },
    @{ old = 'resource_id:'; new = 'id_sumber_daya:' },
    @{ old = 'ip_address:'; new = 'alamat_ip:' },
    @{ old = 'user_agent:'; new = 'agen_pengguna:' },
    @{ old = 'created_at:'; new = 'dibuat_pada:' },
    @{ old = 'updated_at:'; new = 'diperbarui_pada:' },
    @{ old = 'full_name:'; new = 'nama_lengkap:' },
    @{ old = 'avatar_url:'; new = 'url_avatar:' },
    @{ old = 'logo_url:'; new = 'url_logo:' },
    @{ old = 'tenant:'; new = 'lembaga:' },
    @{ old = 'enrollment:'; new = 'pendaftaran_kursus:' },
    @{ old = 'progress:'; new = 'kemajuan_belajar:' },
    @{ old = 'audit_logs:'; new = 'log_audit:' },
    @{ old = 'action:'; new = 'aksi:' },
    @{ old = 'details:'; new = 'detail:' }
)

$file = "d:\kerjabaik.ai\ACADEMY\frontend\src\shared\tipe\database.types.ts"
$content = Get-Content $file -Raw

foreach ($m in $mappings) {
    if ($content.Contains($m.old)) {
        $content = $content.Replace($m.old, $m.new)
    }
}

$content | Set-Content $file -NoNewline
