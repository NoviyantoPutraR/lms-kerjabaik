import fs from 'fs';
import path from 'path';

const mappings = [
    ['enrollment', 'pendaftaran_kursus'],
    ['audit_logs', 'log_audit'],
    ['progress', 'kemajuan_belajar'],
    ['tenant', 'lembaga'],
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
    ['logo_url', 'url_logo']
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = walk('src');

files.forEach(file => {
    if (file.includes('database.types.ts')) return;

    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    mappings.forEach(([oldName, newName]) => {
        const regex = new RegExp(`(['"\`])${oldName}(['"\`])`, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, `$1${newName}$2`);
            changed = true;
        }
    });

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
    }
});
