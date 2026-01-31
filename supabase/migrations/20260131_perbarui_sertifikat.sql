-- ============================================================================
-- LMS - Pembaruan Tabel Sertifikat (Bahasa Indonesia)
-- ============================================================================
-- Migration: 20260131_perbarui_sertifikat
-- Description: Menyesuaikan tabel sertifikat dengan persyaratan snapshot nama dan RLS
-- ============================================================================

BEGIN;

-- 1. Penyesuaian Kolom Tabel sertifikat
DO $$ 
BEGIN
    -- Rename enrollment_id jika belum diubah (antisipasi inkonsistensi migration sebelumnya)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sertifikat' AND column_name = 'enrollment_id') THEN
        ALTER TABLE sertifikat RENAME COLUMN enrollment_id TO id_pendaftaran;
    END IF;

    -- Tambahkan kolom snapshot nama lengkap
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sertifikat' AND column_name = 'nama_lengkap_snapshot') THEN
        ALTER TABLE sertifikat ADD COLUMN nama_lengkap_snapshot VARCHAR(255);
    END IF;

    -- Rename tanggal_terbit ke issued_at agar lebih standar teknis (opsional, tapi user minta issued_at di plan)
    -- Namun di user request awal mereka sebut issued_at tapi juga minta Bahasa Indonesia.
    -- Saya akan buat issued_at sebagai timestamp utama.
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sertifikat' AND column_name = 'tanggal_terbit') THEN
        ALTER TABLE sertifikat RENAME COLUMN tanggal_terbit TO issued_at;
    END IF;
END $$;

-- 2. Perbarui Fungsi Pembuatan Nomor Sertifikat (Jika Perlu)
-- Default format: CERT-YYYYMM-XXXXX
-- User minta CERT-YYYY-XXXXX (misal CERT-2024-00001) atau mirip.
CREATE OR REPLACE FUNCTION generate_nomor_sertifikat_v2(
  p_kursus_id UUID,
  p_pengguna_id UUID
)
RETURNS VARCHAR AS $$
DECLARE
  v_nomor VARCHAR;
  v_tahun VARCHAR;
  v_counter INTEGER;
BEGIN
  v_tahun := TO_CHAR(NOW(), 'YYYY');
  
  -- Ambil counter untuk tahun ini
  SELECT COUNT(*) + 1 INTO v_counter
  FROM sertifikat
  WHERE DATE_TRUNC('year', issued_at) = DATE_TRUNC('year', NOW());
  
  v_nomor := 'CERT-' || v_tahun || '-' || LPAD(v_counter::TEXT, 5, '0');
  
  RETURN v_nomor;
END;
$$ LANGUAGE plpgsql;

-- 3. Kebijakan RLS (Row Level Security)
ALTER TABLE sertifikat ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pengguna dapat melihat sertifikat mereka sendiri" ON sertifikat;
CREATE POLICY "Pengguna dapat melihat sertifikat mereka sendiri" 
ON sertifikat FOR SELECT 
USING (
  id_pengguna IN (SELECT id FROM pengguna WHERE auth_id = auth.uid())
);

DROP POLICY IF EXISTS "Admin dapat melihat semua sertifikat" ON sertifikat;
CREATE POLICY "Admin dapat melihat semua sertifikat" 
ON sertifikat FOR SELECT 
USING (cek_apakah_admin());

COMMIT;
