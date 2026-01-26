-- ============================================================================
-- RLS Policies untuk Instruktur - Tugas
-- ============================================================================
-- Migration: 20260123_rls_instruktur_tugas
-- Description: Row Level Security policies untuk instruktur pada tabel tugas
-- ============================================================================

-- ============================================================================
-- POLICIES UNTUK TUGAS
-- ============================================================================

-- Instruktur bisa lihat tugas dari kursus yang diajar
CREATE POLICY "Instruktur dapat melihat tugas dari kursus yang diajar"
  ON tugas FOR SELECT
  USING (
    asesmen_id IN (
      SELECT a.id
      FROM asesmen a
      INNER JOIN kursus k ON a.kursus_id = k.id
      WHERE k.instruktur_id = (
        SELECT id 
        FROM pengguna 
        WHERE auth_id = auth.uid()
      )
    )
  );

-- Instruktur bisa create tugas untuk kursus yang diajar
CREATE POLICY "Instruktur dapat membuat tugas"
  ON tugas FOR INSERT
  WITH CHECK (
    asesmen_id IN (
      SELECT a.id
      FROM asesmen a
      INNER JOIN kursus k ON a.kursus_id = k.id
      WHERE k.instruktur_id = (
        SELECT id 
        FROM pengguna 
        WHERE auth_id = auth.uid()
      )
    )
  );

-- Instruktur bisa update tugas dari kursus yang diajar
CREATE POLICY "Instruktur dapat update tugas"
  ON tugas FOR UPDATE
  USING (
    asesmen_id IN (
      SELECT a.id
      FROM asesmen a
      INNER JOIN kursus k ON a.kursus_id = k.id
      WHERE k.instruktur_id = (
        SELECT id 
        FROM pengguna 
        WHERE auth_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    asesmen_id IN (
      SELECT a.id
      FROM asesmen a
      INNER JOIN kursus k ON a.kursus_id = k.id
      WHERE k.instruktur_id = (
        SELECT id 
        FROM pengguna 
        WHERE auth_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- POLICIES UNTUK PENGUMPULAN TUGAS
-- ============================================================================

-- Instruktur bisa lihat pengumpulan tugas dari kursus yang diajar
CREATE POLICY "Instruktur dapat melihat pengumpulan tugas"
  ON pengumpulan_tugas FOR SELECT
  USING (
    tugas_id IN (
      SELECT t.id
      FROM tugas t
      INNER JOIN asesmen a ON t.asesmen_id = a.id
      INNER JOIN kursus k ON a.kursus_id = k.id
      WHERE k.instruktur_id = (
        SELECT id 
        FROM pengguna 
        WHERE auth_id = auth.uid()
      )
    )
  );

-- Instruktur bisa menilai (update) pengumpulan tugas
CREATE POLICY "Instruktur dapat menilai pengumpulan tugas"
  ON pengumpulan_tugas FOR UPDATE
  USING (
    tugas_id IN (
      SELECT t.id
      FROM tugas t
      INNER JOIN asesmen a ON t.asesmen_id = a.id
      INNER JOIN kursus k ON a.kursus_id = k.id
      WHERE k.instruktur_id = (
        SELECT id 
        FROM pengguna 
        WHERE auth_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    tugas_id IN (
      SELECT t.id
      FROM tugas t
      INNER JOIN asesmen a ON t.asesmen_id = a.id
      INNER JOIN kursus k ON a.kursus_id = k.id
      WHERE k.instruktur_id = (
        SELECT id 
        FROM pengguna 
        WHERE auth_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "Instruktur dapat melihat tugas dari kursus yang diajar" ON tugas 
  IS 'Instruktur hanya bisa melihat tugas dari kursus yang mereka ajar';

COMMENT ON POLICY "Instruktur dapat melihat pengumpulan tugas" ON pengumpulan_tugas 
  IS 'Instruktur hanya bisa melihat pengumpulan tugas dari kursus yang mereka ajar';

COMMENT ON POLICY "Instruktur dapat menilai pengumpulan tugas" ON pengumpulan_tugas 
  IS 'Instruktur bisa update nilai dan feedback untuk pengumpulan tugas dari kursus yang mereka ajar';
