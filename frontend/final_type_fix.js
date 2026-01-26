import fs from 'fs';

const mappings = [
    ['tenant_id', 'id_lembaga'],
    ['kursus_id', 'id_kursus'],
    ['pengguna_id', 'id_pengguna'],
    ['progress_persen', 'persentase_kemajuan'],
    ['materi_id', 'id_materi'],
    ['enrollment_id', 'id_pendaftaran'],
    ['user_id', 'id_pengguna'],
    ['action', 'aksi'],
    ['resource_type', 'tipe_sumber_daya'],
    ['resource_id', 'id_sumber_daya'],
    ['details', 'detail'],
    ['ip_address', 'alamat_ip'],
    ['user_agent', 'agen_pengguna'],
    ['created_at', 'dibuat_pada'],
    ['updated_at', 'diperbarui_pada'],
    ['full_name', 'nama_lengkap'],
    ['avatar_url', 'url_avatar'],
    ['logo_url', 'url_logo'],
    ['tenant', 'lembaga'],
    ['enrollment', 'pendaftaran_kursus'],
    ['progress', 'kemajuan_belajar'],
    ['audit_logs', 'log_audit']
];

const file = 'src/shared/tipe/database.types.ts';
let content = fs.readFileSync(file, 'utf8');

mappings.forEach(([oldName, newName]) => {
    // Replace all occurrences of oldName with newName using word boundaries
    const regex = new RegExp(`\\b${oldName}\\b`, 'g');
    content = content.replace(regex, newName);
});

fs.writeFileSync(file, content, 'utf8');
