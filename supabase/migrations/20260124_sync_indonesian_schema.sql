-- ============================================================================
-- LMS Multi-Tenant - Sinkronisasi Skema Bahasa Indonesia
-- ============================================================================
-- Migration: 20260124_sync_indonesian_schema
-- Description: Menuntaskan sinkronisasi nama kolom, fungsi, dan RLS ke Bahasa Indonesia
-- ============================================================================

BEGIN;

-- 1. PERBAIKAN NAMA KOLOM (SNAKE_CASE BAHASA INDONESIA)
-- Tabel pendaftaran_kursus (sebelumnya enrollment)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pendaftaran_kursus' AND column_name = 'progress_persen') THEN
        ALTER TABLE pendaftaran_kursus RENAME COLUMN progress_persen TO persentase_kemajuan;
    END IF;
END $$;

-- Tabel progres_belajar (sebelumnya progress)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'progres_belajar' AND column_name = 'progress_persen') THEN
        ALTER TABLE progres_belajar RENAME COLUMN progress_persen TO persentase_kemajuan;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'progres_belajar' AND column_name = 'enrollment_id') THEN
        ALTER TABLE progres_belajar RENAME COLUMN enrollment_id TO id_pendaftaran;
    END IF;
END $$;

-- Tabel sertifikat
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sertifikat' AND column_name = 'enrollment_id') THEN
        ALTER TABLE sertifikat RENAME COLUMN enrollment_id TO id_pendaftaran;
    END IF;
END $$;

-- Tabel log_audit (sudah diubah tapi pastikan kolomnya)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'log_audit' AND column_name = 'user_id') THEN
        ALTER TABLE log_audit RENAME COLUMN user_id TO id_pengguna;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'log_audit' AND column_name = 'tenant_id') THEN
        ALTER TABLE log_audit RENAME COLUMN tenant_id TO id_lembaga;
    END IF;
END $$;

-- 2. PERBAIKAN FUNGSI HELPER (BAHASA INDONESIA)
-- Ambil ID Lembaga
CREATE OR REPLACE FUNCTION public.ambil_id_lembaga_saat_ini()
RETURNS UUID AS $$
  SELECT id_lembaga FROM pengguna WHERE auth_id = auth.uid() LIMIT 1
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Check Admin
CREATE OR REPLACE FUNCTION public.cek_apakah_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM pengguna 
    WHERE auth_id = auth.uid() AND role IN ('superadmin', 'admin')
  )
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Check Superadmin
CREATE OR REPLACE FUNCTION public.cek_apakah_superadmin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM pengguna 
    WHERE auth_id = auth.uid() AND role = 'superadmin'
  )
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Tambahkan alias untuk kompatibilitas script lama (jika ada)
CREATE OR REPLACE FUNCTION public.get_current_tenant_id() RETURNS UUID AS 'SELECT public.ambil_id_lembaga_saat_ini()' LANGUAGE SQL;
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS 'SELECT public.cek_apakah_admin()' LANGUAGE SQL;
CREATE OR REPLACE FUNCTION public.is_superadmin() RETURNS BOOLEAN AS 'SELECT public.cek_apakah_superadmin()' LANGUAGE SQL;

-- 3. PEMBARUAN KEBIJAKAN RLS
-- Kita drop dan recreate kebijakan yang menggunakan nama kolom lama

-- Lembaga
DROP POLICY IF EXISTS "Superadmin dapat melihat semua tenant" ON lembaga;
CREATE POLICY "Superadmin dapat melihat semua lembaga" ON lembaga FOR SELECT USING (cek_apakah_superadmin());

DROP POLICY IF EXISTS "Admin dapat melihat tenant mereka" ON lembaga;
CREATE POLICY "Admin dapat melihat lembaga mereka" ON lembaga FOR SELECT USING (id = ambil_id_lembaga_saat_ini());

-- Pengguna
DROP POLICY IF EXISTS "Admin dapat melihat pengguna di tenant mereka" ON pengguna;
CREATE POLICY "Admin dapat melihat pengguna di lembaga mereka" ON pengguna FOR SELECT USING (id_lembaga = ambil_id_lembaga_saat_ini());

-- Kursus
DROP POLICY IF EXISTS "Pengguna dapat melihat kursus published" ON kursus;
CREATE POLICY "Pengguna dapat melihat kursus yang diterbitkan" ON kursus FOR SELECT 
USING (
    id_lembaga = ambil_id_lembaga_saat_ini() AND 
    (status = 'published' OR instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR cek_apakah_admin())
);

-- Pendaftaran Kursus
DROP POLICY IF EXISTS "Pembelajar dapat enroll" ON pendaftaran_kursus;
CREATE POLICY "Pembelajar dapat mendaftar kursus" ON pendaftaran_kursus FOR INSERT 
WITH CHECK (
    id_pengguna IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) AND
    id_kursus IN (SELECT id FROM kursus WHERE id_lembaga = ambil_id_lembaga_saat_ini() AND status = 'published')
);

COMMIT;
