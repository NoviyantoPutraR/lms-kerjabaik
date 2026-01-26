# Patch Plan: Admin & Superadmin (Setelah Rename Bahasa)

Dokumen patch plan ini merinci langkah-langkah eksekusi untuk memperbaiki dan mengimplementasikan perubahan pada area Admin dan Superadmin, sesuai dengan audit yang telah disusun.

Tujuan
- Menyelesaikan inkonsistensi path alias setelah rename bahasa, typing, dan kestabilan import.
- Mengamankan akses (RBAC) dan konsistensi API terhadap backend Supabase.
- Menyederhanakan alur CRUD untuk administrasi pengguna, kursus, lembaga, serta laporan.

Ruang Lingkup Patch
- Admin Panel: HalamanPenggunaAdmin, HalamanKursusAdmin, HalamanDetailKursusAdmin, HalamanDasborAdmin, HalamanLaporanAdmin
- Superadmin Panel: TenantsPage, TenantDetailPage, AnalyticsPage, AuditLogsPage, GlobalUsersPage
- Instruktur Panel: AssessmentCenterPage, InstructorDashboard, InstructorCoursesPage, InstructorCourseDetailPage, CourseContentEditorPage, StudentProgressPage
- Infrastruktur: path alias, login flow, RBAC, REST vs JS client, logging & error handling

Pendekatan Eksekusi
- Fase A: Setup alias konsisten
  - Tujuan: Pastikan semua path alias menggunakan satu pola konsisten (misalnya @/komponen/ui/..., @/fitur/*).
  - Tindakan: Update tsconfig.json dan lakukan pencarian sisa import yang menggunakan alias lama; patch satu per satu.

- Fase B: Typing & event handlers
  - Tujuan: Hilangkan TS errors terkait onOpenChange dan event handler lain.
  - Tindakan: Tambah tipe eksplisit di onOpenChange di halaman terkait (HalamanPenggunaAdmin, HalamanKursusAdmin, HalamanDetailKursusAdmin, HalamanLaporanAdmin, dll).

- Fase C: Stabilkan dialog UI import
  - Tujuan: Pastikan DialogPenggunaAdmin mengimpor UI dialog melalui path yang konsisten.
  - Tindakan: Pastikan semua file DialogPenggunaAdmin menggunakan path yang konsisten seperti @/komponen/ui/dialog atau import wrapper jika diperlukan.

- Fase D: Migrasi ke Supabase JS Client (opsional)
  - Tujuan: Meningkatkan kestabilan panggilan API untuk CRUD admin.
  - Opsi: Ubah panggilan REST ke supabase-js client (supabase.from('pengguna')...).
  - Tindakan: Draft patch pada fetch/endpoint login admin untuk mencoba migrasi.

- Fase E: Keamanan & RBAC
  - Tujuan: Pastikan semua panel memiliki proteksi peran sesuai RBAC/RLS.
  - Tindakan: Audit ProtectedRoute usage di router; tambahkan guard di halaman yang seharusnya hanya bisa diakses superadmin/admin.

- Fase F: Pengujian & Dokumentasi
  - Tujuan: Verifikasi implementasi & mencegah regresi.
  - Tindakan: Unit tests untuk form validasi, e2e tests/dummy tests untuk alur login, CRUD; dokumentasi patch di changelog.

Daftar Patch (Rincian per Domain)

A. Admin Domain
- Patch A1: Konsistensi Path Aliases
  - Target: semua import di HalamanPenggunaAdmin, HalamanKursusAdmin, HalamanDetailKursusAdmin, HalamanDasborAdmin, HalamanLaporanAdmin, dialog admin.
  - Metode: ubah path alias menjadi satu pola konvensional (mis. @/komponen/ui/dialog, @/komponen/ui/button, dsb).
  - Akibat: import tidak lagi gagal saat build.

- Patch A2: typing onOpenChange di halaman dialog admin
  - Target: HalamanPenggunaAdmin.tsx, HalamanKursusAdmin.tsx, HalamanDetailKursusAdmin.tsx, HalamanLaporanAdmin.tsx, dst.
  - Perubahan: tambahkan tipe `onOpenChange={(open: boolean) => { ... }}`
  - Alasan: menghilangkan TS6133/TS7006.

- Patch A3: Konsolidasi DialogPenggunaAdmin import
  - Target: DialogPenggunaAdmin.tsx di admin
  - Perubahan: pastikan import UI Dialog konsisten (mis. @/komponen/ui/dialog).

- Patch A4: Migrasi API ke Supabase JS Client (opsional)
  - Target: fetch login, CRUD pengguna, dsb.
  - Perubahan: ganti REST call dengan `supabase.from('pengguna')...`.
- Patch A5: Pengujian & Dokumentasi
  - Target: patch test scaffolding, docs.

B. Superadmin Domain
- Patch B1: Konsolidasi path alias di halaman TenantsPage, TenantDetailPage, AnalyticsPage, AuditLogsPage, GlobalUsersPage
- Patch B2: RBAC & akses
- Patch B3: Synchronize API calls (Supabase) untuk data visualization
- Patch B4: Testing & Dokumentasi

c. Instruktur Domain
- Patch C1: Pastikan AssessmentCenterPage dan halaman terkait dapat diakses oleh instruktur
- Patch C2: Perbaiki import path & tipe
- Patch C3: Data model konsistensi (FK dengan kursus/dosen)
- Patch C4: Testing & Dokumentasi

12) Langkah Validasi Eksekusi
- Jalankan build: npm run build
- Jalankan lint: npm run lint
- Jalankan tests: npm test (jika tersedia) / npm run test:e2e (gunakan Cypress/Nitro jika ada)
- QA manual: login sebagai superadmin, admin, instruktur; verifikasi CRUD, laporan, dan dashboard bekerja tanpa error.
- Dokumentasi patch: tambahkan catatan pada changelog.

13) Timeline
- Phase 1 (1–2 minggu): Audit dan konsolidasi alias, typing, dan login flow
- Phase 2 (2–4 minggu): Implement patch patch per domain dan integrasi RBAC
- Phase 3 (1–2 minggu): Testing, QA, dokumentasi, dan deployment

14) Risiko & Mitigasi
- Risiko: broken imports karena rename; mitigasi: patch bertahap dengan commit kecil
- Risiko: RBAC tidak konsisten; mitigasi: uji akses per rute
- Risiko: performa karena CRUD berat; mitigasi: code-splitting + lazy loading

Dokumen patch plan ini bisa dijadikan acuan PR dan task board.

---
