-- ============================================================================
-- LMS Multi-Tenant - Tabel Tugas dan Sertifikat
-- ============================================================================
-- Migration: 20260123_tugas_sertifikat
-- Description: Menambahkan tabel tugas, pengumpulan_tugas, dan sertifikat
-- ============================================================================

-- ============================================================================
-- TABEL TUGAS (ASSIGNMENTS)
-- ============================================================================

-- Tabel tugas
CREATE TABLE IF NOT EXISTS tugas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asesmen_id UUID REFERENCES asesmen(id) ON DELETE CASCADE,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  deadline TIMESTAMPTZ,
  max_file_size BIGINT DEFAULT 10485760, -- 10MB default
  allowed_extensions TEXT[], -- contoh: ARRAY['pdf', 'doc', 'docx']
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_tugas_asesmen ON tugas(asesmen_id);
CREATE INDEX idx_tugas_deadline ON tugas(deadline);

-- Tabel pengumpulan tugas
CREATE TABLE IF NOT EXISTS pengumpulan_tugas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tugas_id UUID REFERENCES tugas(id) ON DELETE CASCADE,
  pengguna_id UUID REFERENCES pengguna(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  catatan TEXT,
  nilai DECIMAL(5,2),
  feedback TEXT,
  status VARCHAR(20) DEFAULT 'dikumpulkan' CHECK (status IN ('dikumpulkan', 'dinilai', 'revisi')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tugas_id, pengguna_id)
);

-- Index untuk performa
CREATE INDEX idx_pengumpulan_tugas ON pengumpulan_tugas(tugas_id);
CREATE INDEX idx_pengumpulan_pengguna ON pengumpulan_tugas(pengguna_id);
CREATE INDEX idx_pengumpulan_status ON pengumpulan_tugas(status);

-- ============================================================================
-- TABEL SERTIFIKAT
-- ============================================================================

-- Tabel sertifikat
CREATE TABLE IF NOT EXISTS sertifikat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES enrollment(id) ON DELETE CASCADE,
  pengguna_id UUID REFERENCES pengguna(id) ON DELETE CASCADE,
  kursus_id UUID REFERENCES kursus(id) ON DELETE CASCADE,
  nomor_sertifikat VARCHAR(100) UNIQUE NOT NULL,
  tanggal_terbit TIMESTAMPTZ DEFAULT NOW(),
  nilai_akhir DECIMAL(5,2),
  file_url TEXT,
  metadata JSONB DEFAULT '{}', -- untuk data tambahan seperti QR code, signature, etc
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_sertifikat_enrollment ON sertifikat(enrollment_id);
CREATE INDEX idx_sertifikat_pengguna ON sertifikat(pengguna_id);
CREATE INDEX idx_sertifikat_kursus ON sertifikat(kursus_id);
CREATE INDEX idx_sertifikat_nomor ON sertifikat(nomor_sertifikat);

-- ============================================================================
-- TRIGGERS UNTUK AUTO UPDATE TIMESTAMP
-- ============================================================================

CREATE TRIGGER update_tugas_updated_at BEFORE UPDATE ON tugas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pengumpulan_tugas_updated_at BEFORE UPDATE ON pengumpulan_tugas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTION UNTUK GENERATE NOMOR SERTIFIKAT
-- ============================================================================

-- Function untuk generate nomor sertifikat unik
CREATE OR REPLACE FUNCTION generate_nomor_sertifikat(
  p_kursus_id UUID,
  p_pengguna_id UUID
)
RETURNS VARCHAR AS $$
DECLARE
  v_nomor VARCHAR;
  v_tahun VARCHAR;
  v_bulan VARCHAR;
  v_counter INTEGER;
BEGIN
  -- Format: CERT-YYYYMM-XXXXX
  v_tahun := TO_CHAR(NOW(), 'YYYY');
  v_bulan := TO_CHAR(NOW(), 'MM');
  
  -- Get counter untuk bulan ini
  SELECT COUNT(*) + 1 INTO v_counter
  FROM sertifikat
  WHERE DATE_TRUNC('month', tanggal_terbit) = DATE_TRUNC('month', NOW());
  
  -- Generate nomor dengan padding
  v_nomor := 'CERT-' || v_tahun || v_bulan || '-' || LPAD(v_counter::TEXT, 5, '0');
  
  RETURN v_nomor;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE tugas IS 'Tabel untuk menyimpan data tugas/assignment yang diberikan instruktur';
COMMENT ON TABLE pengumpulan_tugas IS 'Tabel untuk menyimpan pengumpulan tugas oleh pembelajar';
COMMENT ON TABLE sertifikat IS 'Tabel untuk menyimpan sertifikat yang diterbitkan untuk pembelajar';
COMMENT ON FUNCTION generate_nomor_sertifikat IS 'Function untuk generate nomor sertifikat unik dengan format CERT-YYYYMM-XXXXX';
