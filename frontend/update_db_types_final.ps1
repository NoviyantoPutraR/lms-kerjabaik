$mappings = @(
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

$file = "d:\kerjabaik.ai\ACADEMY\frontend\src\shared\tipe\database.types.ts"
$content = Get-Content $file -Raw

foreach ($m in $mappings) {
    $content = $content -replace "\b$($m[0])\b", $m[1]
}

$content | Set-Content $file -NoNewline
