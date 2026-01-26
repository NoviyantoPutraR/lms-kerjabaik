-- ============================================================================
-- LMS Multi-Tenant - RLS Policies untuk Pembelajar
-- ============================================================================
-- Migration: 20260123_rls_pembelajar
-- Description: Row Level Security policies untuk role pembelajar
-- ============================================================================

-- ============================================================================
-- POLICIES UNTUK KURSUS
-- ============================================================================

-- Pembelajar hanya bisa lihat kursus published dalam tenant yang sama
CREATE POLICY "Pembelajar dapat melihat kursus published"
  ON kursus FOR SELECT
  USING (
    status = 'published' 
    AND tenant_id = (
      SELECT tenant_id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  );

-- ============================================================================
-- POLICIES UNTUK ENROLLMENT
-- ============================================================================

-- Pembelajar hanya bisa lihat enrollment sendiri
CREATE POLICY "Pembelajar dapat melihat enrollment sendiri"
  ON enrollment FOR SELECT
  USING (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  );

-- Pembelajar bisa enroll kursus (insert)
CREATE POLICY "Pembelajar dapat enroll kursus"
  ON enrollment FOR INSERT
  WITH CHECK (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  );

-- Pembelajar bisa update enrollment sendiri (untuk cancel)
CREATE POLICY "Pembelajar dapat update enrollment sendiri"
  ON enrollment FOR UPDATE
  USING (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  )
  WITH CHECK (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  );

-- ============================================================================
-- POLICIES UNTUK PROGRESS
-- ============================================================================

-- Pembelajar bisa lihat progress sendiri
CREATE POLICY "Pembelajar dapat melihat progress sendiri"
  ON progress FOR SELECT
  USING (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  );

-- Pembelajar bisa insert progress sendiri
CREATE POLICY "Pembelajar dapat insert progress"
  ON progress FOR INSERT
  WITH CHECK (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  );

-- Pembelajar bisa update progress sendiri
CREATE POLICY "Pembelajar dapat update progress sendiri"
  ON progress FOR UPDATE
  USING (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  )
  WITH CHECK (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  );

-- ============================================================================
-- POLICIES UNTUK TUGAS
-- ============================================================================

-- Pembelajar bisa lihat tugas dari kursus yang diikuti
CREATE POLICY "Pembelajar dapat melihat tugas dari kursus yang diikuti"
  ON tugas FOR SELECT
  USING (
    asesmen_id IN (
      SELECT a.id
      FROM asesmen a
      INNER JOIN enrollment e ON e.kursus_id = a.kursus_id
      WHERE e.pengguna_id = (
        SELECT id 
        FROM pengguna 
        WHERE auth_id = auth.uid()
      )
    )
  );

-- Pembelajar bisa lihat pengumpulan tugas sendiri
CREATE POLICY "Pembelajar dapat melihat pengumpulan tugas sendiri"
  ON pengumpulan_tugas FOR SELECT
  USING (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  );

-- Pembelajar bisa submit tugas (insert)
CREATE POLICY "Pembelajar dapat submit tugas"
  ON pengumpulan_tugas FOR INSERT
  WITH CHECK (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  );

-- Pembelajar bisa update pengumpulan tugas sendiri (sebelum dinilai)
CREATE POLICY "Pembelajar dapat update pengumpulan tugas sendiri"
  ON pengumpulan_tugas FOR UPDATE
  USING (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
    AND status = 'dikumpulkan' -- hanya bisa update jika belum dinilai
  )
  WITH CHECK (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  );

-- ============================================================================
-- POLICIES UNTUK ASESMEN
-- ============================================================================

-- Pembelajar bisa lihat asesmen published dari kursus yang diikuti
CREATE POLICY "Pembelajar dapat melihat asesmen dari kursus yang diikuti"
  ON asesmen FOR SELECT
  USING (
    status = 'published'
    AND kursus_id IN (
      SELECT kursus_id
      FROM enrollment
      WHERE pengguna_id = (
        SELECT id 
        FROM pengguna 
        WHERE auth_id = auth.uid()
      )
    )
  );

-- Pembelajar bisa lihat soal dari asesmen yang diikuti
CREATE POLICY "Pembelajar dapat melihat soal dari asesmen yang diikuti"
  ON soal FOR SELECT
  USING (
    asesmen_id IN (
      SELECT a.id
      FROM asesmen a
      INNER JOIN enrollment e ON e.kursus_id = a.kursus_id
      WHERE e.pengguna_id = (
        SELECT id 
        FROM pengguna 
        WHERE auth_id = auth.uid()
      )
      AND a.status = 'published'
    )
  );

-- ============================================================================
-- POLICIES UNTUK PERCOBAAN ASESMEN
-- ============================================================================

-- Pembelajar bisa lihat percobaan asesmen sendiri
CREATE POLICY "Pembelajar dapat melihat percobaan asesmen sendiri"
  ON percobaan_asesmen FOR SELECT
  USING (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  );

-- Pembelajar bisa insert percobaan asesmen
CREATE POLICY "Pembelajar dapat insert percobaan asesmen"
  ON percobaan_asesmen FOR INSERT
  WITH CHECK (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  );

-- Pembelajar bisa update percobaan asesmen sendiri
CREATE POLICY "Pembelajar dapat update percobaan asesmen sendiri"
  ON percobaan_asesmen FOR UPDATE
  USING (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  )
  WITH CHECK (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  );

-- ============================================================================
-- POLICIES UNTUK JAWABAN
-- ============================================================================

-- Pembelajar bisa lihat jawaban sendiri
CREATE POLICY "Pembelajar dapat melihat jawaban sendiri"
  ON jawaban FOR SELECT
  USING (
    percobaan_id IN (
      SELECT id
      FROM percobaan_asesmen
      WHERE pengguna_id = (
        SELECT id 
        FROM pengguna 
        WHERE auth_id = auth.uid()
      )
    )
  );

-- Pembelajar bisa insert jawaban
CREATE POLICY "Pembelajar dapat insert jawaban"
  ON jawaban FOR INSERT
  WITH CHECK (
    percobaan_id IN (
      SELECT id
      FROM percobaan_asesmen
      WHERE pengguna_id = (
        SELECT id 
        FROM pengguna 
        WHERE auth_id = auth.uid()
      )
    )
  );

-- Pembelajar bisa update jawaban sendiri (untuk auto-save)
CREATE POLICY "Pembelajar dapat update jawaban sendiri"
  ON jawaban FOR UPDATE
  USING (
    percobaan_id IN (
      SELECT id
      FROM percobaan_asesmen
      WHERE pengguna_id = (
        SELECT id 
        FROM pengguna 
        WHERE auth_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    percobaan_id IN (
      SELECT id
      FROM percobaan_asesmen
      WHERE pengguna_id = (
        SELECT id 
        FROM pengguna 
        WHERE auth_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- POLICIES UNTUK SERTIFIKAT
-- ============================================================================

-- Pembelajar bisa lihat sertifikat sendiri
CREATE POLICY "Pembelajar dapat melihat sertifikat sendiri"
  ON sertifikat FOR SELECT
  USING (
    pengguna_id = (
      SELECT id 
      FROM pengguna 
      WHERE auth_id = auth.uid()
    )
  );

-- ============================================================================
-- POLICIES UNTUK MODUL DAN MATERI
-- ============================================================================

-- Pembelajar bisa lihat modul dari kursus yang diikuti
CREATE POLICY "Pembelajar dapat melihat modul dari kursus yang diikuti"
  ON modul FOR SELECT
  USING (
    kursus_id IN (
      SELECT kursus_id
      FROM enrollment
      WHERE pengguna_id = (
        SELECT id 
        FROM pengguna 
        WHERE auth_id = auth.uid()
      )
    )
  );

-- Pembelajar bisa lihat materi dari kursus yang diikuti
CREATE POLICY "Pembelajar dapat melihat materi dari kursus yang diikuti"
  ON materi FOR SELECT
  USING (
    modul_id IN (
      SELECT m.id
      FROM modul m
      INNER JOIN enrollment e ON e.kursus_id = m.kursus_id
      WHERE e.pengguna_id = (
        SELECT id 
        FROM pengguna 
        WHERE auth_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- ENABLE RLS
-- ============================================================================

-- Enable RLS untuk semua tabel jika belum enabled
ALTER TABLE kursus ENABLE ROW LEVEL SECURITY;
ALTER TABLE modul ENABLE ROW LEVEL SECURITY;
ALTER TABLE materi ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE tugas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengumpulan_tugas ENABLE ROW LEVEL SECURITY;
ALTER TABLE asesmen ENABLE ROW LEVEL SECURITY;
ALTER TABLE soal ENABLE ROW LEVEL SECURITY;
ALTER TABLE percobaan_asesmen ENABLE ROW LEVEL SECURITY;
ALTER TABLE jawaban ENABLE ROW LEVEL SECURITY;
ALTER TABLE sertifikat ENABLE ROW LEVEL SECURITY;
