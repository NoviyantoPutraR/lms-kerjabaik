# Audit Lengkap: Admin & Superadmin (Post Rename Bahasa)

Dokumen ini merangkum temuan, penilaian risiko, dan rekomendasi perbaikan terkait Area Admin dan Superadmin setelah perubahan bahasa folder dan struktur file di proyek frontend.

Status: Dokumen ini bersifat audit dan tidak secara otomatis mengubah kode. Patch/implementasi akan ditempatkan pada tahapan selanjutnya.

Tanggal: ${DATE}

Table of Contents
- Ringkasan Eksekutif
- Ruang Lingkup
- Metodologi
- Temuan I: Admin Panel
- Temuan II: Superadmin Panel
- Temuan III: Instruktur / Hubungan dengan Admin & Superadmin
- Kebijakan Akses & Keamanan
- Lokalisasi & Nomenklatur
- Rencana Perbaikan (Patch Plan)
- Verifikasi & Acceptance Criteria
- Dokumentasi Tambahan

1) Ringkasan Eksekutif
- Rename bahasa folder telah diterapkan, namun beberapa impor masih kurang konsisten sehingga beberapa modul tidak terresolve pada build awal.
- Beberapa halaman CRUD di Admin dan Superadmin menunjukkan potensi area yang tidak konsisten antara path alias, tipe data, dan struktur data.
- Implementasi RBAC tampak konsisten pada beberapa rute, namun perlu diverifikasi di semua halaman mengikuti pola ProtectedRoute.
- Target utama perbaikan: konsistensi path alias, typing event handler (onOpenChange), dan migrasi import Dialog ke jalur konsisten.

2) Ruang Lingkup
- Admin Panel:
  - HalamanPenggunaAdmin
  - HalamanKursusAdmin
  - HalamanDetailKursusAdmin
  - HalamanDasborAdmin
  - HalamanLaporanAdmin
- Superadmin Panel:
  - TenantsPage
  - TenantDetailPage
  - AnalyticsPage
  - AuditLogsPage
  - GlobalUsersPage
- Instruktur Panel (terkait dengan operasional admin):
  - AssessmentCenterPage
  - InstructorDashboard
  - InstructorCoursesPage
  - InstructorCourseDetailPage
  - CourseContentEditorPage
  - StudentProgressPage
- Infrastruktur: path alias, login flow, RBAC, REST vs JS client (Supabase)

3) Metodologi
- Pemeriksaan statis: cara import path, typing, dan impor eksternal
- Mapping data model dan hubungan dengan DB (FK, relasi, constraint)
- Verifikasi alur login, CRUD, laporan, dan ekspor data
- Uji keamanan: akses berbasis peran (RBAC/RLS)
- Uji performa: potensi bottleneck pada query berat

4) Temuan I: Admin Panel
- HalamanPenggunaAdmin
  - Temuan: Import path admin tidak konsisten antara `@/komponen/...` vs `@/components/...`; beberapa filejs/ts menunjukkan path alias yang berubah pasca rename.
  - Remediasi: pastikan semua import path menggunakan satu pola alias konsisten; tambah typing di event handler (onOpenChange) untuk dialog.
  - Catatan: DialogPenggunaAdmin perlu konsistensi path alias untuk Dialog UI.
- HalamanKursusAdmin
  - Temuan: Kebutuhan verifikasi hubungan kursus dengan lembaga/instruktur; validasi form yang memadai; konsistensi error handling.
  - Remediasi: review API usage (REST vs JS) pada CRUD kursus.
- HalamanDetailKursusAdmin
  - Temuan: Pengelolaan modul/asesmen terkait modul; potensi inkonsistensi nama field modul.
- HalamanDasborAdmin
  - Temuan: Indikator KPI diambil dari API; pastikan konsistensi data antar endpoint.
- HalamanLaporanAdmin
  - Temuan: Banyak chart menggunakan Recharts; chunking meningkat setelah lazy loading, namun 1-2 chart masih besar.
  - Remediasi: pastikan chart lazy load sepenuhnya; pecah chart menjadi modul terpisah agar bundel tidak terlalu besar.

5) Temuan II: Superadmin Panel
- TenantsPage / TenantDetailPage
  - Temuan: struktur data lembaga (tenant) perlu konsistensi field; RBAC perlu dipastikan untuk peran superadmin
- AnalyticsPage
  - Temuan: integrasi data analytics; data source dari Supabase perlu diverifikasi untuk RBAC
- AuditLogsPage
  - Temuan: akses log audit; pastikan filter pencarian berfungsi; ekspor log bekerja jika diperlukan
- GlobalUsersPage
  - Temuan: manajemen pengguna global; perhatikan isolasi data antar tenant

6) Temuan III: Instruktur / Hubungan Admin-Superadmin
- Pemetaan relasi kursus, modul, asesmen, pendaftaran kursus, dan pengumpulan tugas antara peran
- Akses terhadap data lintas tenant perlu dibatasi sesuai kebijakan peran

7) Kebijakan Akses & Keamanan
- Pastikan ProtectedRoute benar diterapkan untuk semua rute admin/superadmin
- Verifikasi RBAC/RLS pada tabel utama (pengguna, lembaga, kursus, asesmen, dsb.) di Supabase
- Penanganan error UI agar user friendly dan tidak membocorkan detail sensitif

8) Lokalisasi & Nomenklatur
- Pastikan seluruh teks UI menggunakan Bahasa Indonesia baku
- Pastikan konvensi penamaan: snake_case untuk DB, camelCase untuk variabel, PascalCase untuk kelas/file
- Perbarui tsconfig.json path alias jika diperlukan agar konsisten

9) Rencana Verifikasi
- Build lokal: npm run build
- Lint: npm run lint (jika ada)
- Pengujian manual: jalankan login sebagai superadmin, lakukan CRUD pada admin/superadmin, jalankan laporan, dan test akses RBAC
- Dokumentasi: perbarui dokumentasi internal dan changelog

10) Ringkasan Risiko
- Renaming path alias bisa memicu import error jika ada sisa file yang belum di-update
- Perilaku RBAC bisa salah apabila ada route yang tidak di-protect dengan benar
- Perubahan besar di patching raw data bisa memicu regresi pada data

11) Rekomendasi Prioritas
- Prioritas tinggi: konsistensi path alias dan typing; pastikan login Superadmin berjalan tanpa error
- Prioritas menengah: lazy loading chart & halaman laporan untuk performa
- Prioritas rendah: dokumentasikan semua perubahan dan buat test scaffolding

Dokumen ini bisa dijadikan basis patch plan dan PR tracker pada repository.

---

