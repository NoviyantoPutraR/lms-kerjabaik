-- ============================================================================
-- LMS Multi-Tenant - Initial Database Schema
-- ============================================================================
-- Migration: 20260121_initial_schema
-- Description: Setup tabel utama untuk multi-tenancy, users, courses, dan assessments
-- ============================================================================

-- ============================================================================
-- TABEL MULTI-TENANCY
-- ============================================================================

-- Tabel tenant (organisasi)
CREATE TABLE IF NOT EXISTS tenant (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  tipe VARCHAR(50) NOT NULL CHECK (tipe IN ('provinsi', 'bkd', 'kampus', 'korporasi')),
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif', 'suspended')),
  kuota_pengguna INTEGER DEFAULT 100,
  kuota_penyimpanan BIGINT DEFAULT 10737418240, -- 10GB in bytes
  logo_url TEXT,
  konfigurasi JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_tenant_slug ON tenant(slug);
CREATE INDEX idx_tenant_status ON tenant(status);

-- ============================================================================
-- TABEL USER MANAGEMENT
-- ============================================================================

-- Tabel pengguna (users)
CREATE TABLE IF NOT EXISTS pengguna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenant(id) ON DELETE CASCADE,
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  nama_lengkap VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('superadmin', 'admin', 'instruktur', 'pembelajar')),
  foto_url TEXT,
  nomor_telepon VARCHAR(20),
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif', 'suspended')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_pengguna_tenant ON pengguna(tenant_id);
CREATE INDEX idx_pengguna_auth ON pengguna(auth_id);
CREATE INDEX idx_pengguna_email ON pengguna(email);
CREATE INDEX idx_pengguna_role ON pengguna(role);
CREATE INDEX idx_pengguna_status ON pengguna(status);

-- ============================================================================
-- TABEL COURSE MANAGEMENT
-- ============================================================================

-- Tabel kursus
CREATE TABLE IF NOT EXISTS kursus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenant(id) ON DELETE CASCADE,
  instruktur_id UUID REFERENCES pengguna(id) ON DELETE SET NULL,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  thumbnail_url TEXT,
  kategori VARCHAR(100),
  tingkat VARCHAR(50) CHECK (tingkat IN ('pemula', 'menengah', 'lanjutan')),
  durasi_menit INTEGER,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_kursus_tenant ON kursus(tenant_id);
CREATE INDEX idx_kursus_instruktur ON kursus(instruktur_id);
CREATE INDEX idx_kursus_status ON kursus(status);
CREATE INDEX idx_kursus_kategori ON kursus(kategori);

-- Tabel modul pembelajaran
CREATE TABLE IF NOT EXISTS modul (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kursus_id UUID REFERENCES kursus(id) ON DELETE CASCADE,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  urutan INTEGER NOT NULL,
  durasi_menit INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_modul_kursus ON modul(kursus_id);
CREATE INDEX idx_modul_urutan ON modul(kursus_id, urutan);

-- Tabel materi pembelajaran
CREATE TABLE IF NOT EXISTS materi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modul_id UUID REFERENCES modul(id) ON DELETE CASCADE,
  judul VARCHAR(255) NOT NULL,
  tipe VARCHAR(50) NOT NULL CHECK (tipe IN ('video', 'dokumen', 'teks', 'link')),
  konten TEXT, -- untuk teks atau HTML
  file_url TEXT, -- untuk video/dokumen
  urutan INTEGER NOT NULL,
  durasi_menit INTEGER,
  wajib BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_materi_modul ON materi(modul_id);
CREATE INDEX idx_materi_urutan ON materi(modul_id, urutan);

-- Tabel enrollment (pendaftaran kursus)
CREATE TABLE IF NOT EXISTS enrollment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kursus_id UUID REFERENCES kursus(id) ON DELETE CASCADE,
  pengguna_id UUID REFERENCES pengguna(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'selesai', 'dibatalkan')),
  progress_persen DECIMAL(5,2) DEFAULT 0,
  tanggal_mulai TIMESTAMPTZ DEFAULT NOW(),
  tanggal_selesai TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(kursus_id, pengguna_id)
);

-- Index untuk performa
CREATE INDEX idx_enrollment_kursus ON enrollment(kursus_id);
CREATE INDEX idx_enrollment_pengguna ON enrollment(pengguna_id);
CREATE INDEX idx_enrollment_status ON enrollment(status);

-- Tabel progress pembelajaran
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES enrollment(id) ON DELETE CASCADE,
  materi_id UUID REFERENCES materi(id) ON DELETE CASCADE,
  pengguna_id UUID REFERENCES pengguna(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'belum_mulai' CHECK (status IN ('belum_mulai', 'sedang_belajar', 'selesai')),
  progress_persen DECIMAL(5,2) DEFAULT 0,
  waktu_belajar_detik INTEGER DEFAULT 0,
  terakhir_diakses TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, materi_id)
);

-- Index untuk performa
CREATE INDEX idx_progress_enrollment ON progress(enrollment_id);
CREATE INDEX idx_progress_materi ON progress(materi_id);
CREATE INDEX idx_progress_pengguna ON progress(pengguna_id);

-- ============================================================================
-- TABEL ASSESSMENT
-- ============================================================================

-- Tabel asesmen
CREATE TABLE IF NOT EXISTS asesmen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kursus_id UUID REFERENCES kursus(id) ON DELETE CASCADE,
  modul_id UUID REFERENCES modul(id) ON DELETE SET NULL,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  tipe VARCHAR(50) NOT NULL CHECK (tipe IN ('kuis', 'ujian', 'tugas')),
  durasi_menit INTEGER,
  passing_score DECIMAL(5,2) DEFAULT 70,
  jumlah_percobaan INTEGER DEFAULT 1, -- -1 untuk unlimited
  acak_soal BOOLEAN DEFAULT false,
  tampilkan_jawaban BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_asesmen_kursus ON asesmen(kursus_id);
CREATE INDEX idx_asesmen_modul ON asesmen(modul_id);
CREATE INDEX idx_asesmen_status ON asesmen(status);

-- Tabel soal
CREATE TABLE IF NOT EXISTS soal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asesmen_id UUID REFERENCES asesmen(id) ON DELETE CASCADE,
  pertanyaan TEXT NOT NULL,
  tipe VARCHAR(50) NOT NULL CHECK (tipe IN ('pilihan_ganda', 'pilihan_ganda_multiple', 'benar_salah', 'isian_singkat', 'esai')),
  opsi JSONB, -- untuk pilihan ganda: [{"key": "A", "value": "...", "benar": true}]
  jawaban_benar TEXT, -- untuk isian singkat atau benar/salah
  poin DECIMAL(5,2) DEFAULT 1,
  penjelasan TEXT,
  urutan INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_soal_asesmen ON soal(asesmen_id);
CREATE INDEX idx_soal_urutan ON soal(asesmen_id, urutan);

-- Tabel percobaan asesmen
CREATE TABLE IF NOT EXISTS percobaan_asesmen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asesmen_id UUID REFERENCES asesmen(id) ON DELETE CASCADE,
  pengguna_id UUID REFERENCES pengguna(id) ON DELETE CASCADE,
  nomor_percobaan INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'sedang_berjalan' CHECK (status IN ('sedang_berjalan', 'selesai', 'dibatalkan')),
  nilai DECIMAL(5,2),
  waktu_mulai TIMESTAMPTZ DEFAULT NOW(),
  waktu_selesai TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_percobaan_asesmen ON percobaan_asesmen(asesmen_id);
CREATE INDEX idx_percobaan_pengguna ON percobaan_asesmen(pengguna_id);
CREATE INDEX idx_percobaan_status ON percobaan_asesmen(status);

-- Tabel jawaban
CREATE TABLE IF NOT EXISTS jawaban (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  percobaan_id UUID REFERENCES percobaan_asesmen(id) ON DELETE CASCADE,
  soal_id UUID REFERENCES soal(id) ON DELETE CASCADE,
  jawaban_pengguna TEXT,
  jawaban_pengguna_multiple JSONB, -- untuk multiple choice
  benar BOOLEAN,
  poin_diperoleh DECIMAL(5,2) DEFAULT 0,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(percobaan_id, soal_id)
);

-- Index untuk performa
CREATE INDEX idx_jawaban_percobaan ON jawaban(percobaan_id);
CREATE INDEX idx_jawaban_soal ON jawaban(soal_id);

-- ============================================================================
-- TRIGGERS UNTUK AUTO UPDATE TIMESTAMP
-- ============================================================================

-- Function untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk setiap tabel
CREATE TRIGGER update_tenant_updated_at BEFORE UPDATE ON tenant
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pengguna_updated_at BEFORE UPDATE ON pengguna
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kursus_updated_at BEFORE UPDATE ON kursus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modul_updated_at BEFORE UPDATE ON modul
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materi_updated_at BEFORE UPDATE ON materi
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollment_updated_at BEFORE UPDATE ON enrollment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_asesmen_updated_at BEFORE UPDATE ON asesmen
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_soal_updated_at BEFORE UPDATE ON soal
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_percobaan_asesmen_updated_at BEFORE UPDATE ON percobaan_asesmen
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jawaban_updated_at BEFORE UPDATE ON jawaban
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
