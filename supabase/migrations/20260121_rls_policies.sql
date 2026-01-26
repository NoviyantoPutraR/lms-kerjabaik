-- ============================================================================
-- LMS Multi-Tenant - Row Level Security (RLS) Policies
-- ============================================================================
-- Migration: 20260121_rls_policies
-- Description: Setup RLS policies untuk isolasi data multi-tenant
-- ============================================================================

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE tenant ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengguna ENABLE ROW LEVEL SECURITY;
ALTER TABLE kursus ENABLE ROW LEVEL SECURITY;
ALTER TABLE modul ENABLE ROW LEVEL SECURITY;
ALTER TABLE materi ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE asesmen ENABLE ROW LEVEL SECURITY;
ALTER TABLE soal ENABLE ROW LEVEL SECURITY;
ALTER TABLE percobaan_asesmen ENABLE ROW LEVEL SECURITY;
ALTER TABLE jawaban ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function untuk mendapatkan user ID saat ini
CREATE OR REPLACE FUNCTION auth.current_user_id()
RETURNS UUID AS $$
  SELECT id FROM auth.users WHERE id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function untuk mendapatkan tenant_id pengguna saat ini
CREATE OR REPLACE FUNCTION auth.current_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM pengguna WHERE auth_id = auth.uid() LIMIT 1
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function untuk mendapatkan role pengguna saat ini
CREATE OR REPLACE FUNCTION auth.current_user_role()
RETURNS VARCHAR AS $$
  SELECT role FROM pengguna WHERE auth_id = auth.uid() LIMIT 1
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function untuk check apakah user adalah superadmin
CREATE OR REPLACE FUNCTION auth.is_superadmin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM pengguna 
    WHERE auth_id = auth.uid() AND role = 'superadmin'
  )
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function untuk check apakah user adalah admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM pengguna 
    WHERE auth_id = auth.uid() AND role IN ('superadmin', 'admin')
  )
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ============================================================================
-- RLS POLICIES - TENANT
-- ============================================================================

-- Superadmin dapat melihat semua tenant
CREATE POLICY "Superadmin dapat melihat semua tenant"
  ON tenant FOR SELECT
  USING (auth.is_superadmin());

-- Admin dapat melihat tenant mereka sendiri
CREATE POLICY "Admin dapat melihat tenant mereka"
  ON tenant FOR SELECT
  USING (id = auth.current_tenant_id());

-- Superadmin dapat membuat tenant
CREATE POLICY "Superadmin dapat membuat tenant"
  ON tenant FOR INSERT
  WITH CHECK (auth.is_superadmin());

-- Superadmin dapat update semua tenant
CREATE POLICY "Superadmin dapat update semua tenant"
  ON tenant FOR UPDATE
  USING (auth.is_superadmin())
  WITH CHECK (auth.is_superadmin());

-- Admin dapat update tenant mereka
CREATE POLICY "Admin dapat update tenant mereka"
  ON tenant FOR UPDATE
  USING (id = auth.current_tenant_id() AND auth.is_admin())
  WITH CHECK (id = auth.current_tenant_id() AND auth.is_admin());

-- ============================================================================
-- RLS POLICIES - PENGGUNA
-- ============================================================================

-- Superadmin dapat melihat semua pengguna
CREATE POLICY "Superadmin dapat melihat semua pengguna"
  ON pengguna FOR SELECT
  USING (auth.is_superadmin());

-- Admin dapat melihat pengguna di tenant mereka
CREATE POLICY "Admin dapat melihat pengguna di tenant mereka"
  ON pengguna FOR SELECT
  USING (tenant_id = auth.current_tenant_id());

-- Pengguna dapat melihat profil mereka sendiri
CREATE POLICY "Pengguna dapat melihat profil sendiri"
  ON pengguna FOR SELECT
  USING (auth_id = auth.uid());

-- Superadmin dapat membuat pengguna di semua tenant
CREATE POLICY "Superadmin dapat membuat pengguna"
  ON pengguna FOR INSERT
  WITH CHECK (auth.is_superadmin());

-- Admin dapat membuat pengguna di tenant mereka
CREATE POLICY "Admin dapat membuat pengguna di tenant mereka"
  ON pengguna FOR INSERT
  WITH CHECK (tenant_id = auth.current_tenant_id() AND auth.is_admin());

-- Superadmin dapat update semua pengguna
CREATE POLICY "Superadmin dapat update semua pengguna"
  ON pengguna FOR UPDATE
  USING (auth.is_superadmin())
  WITH CHECK (auth.is_superadmin());

-- Admin dapat update pengguna di tenant mereka
CREATE POLICY "Admin dapat update pengguna di tenant mereka"
  ON pengguna FOR UPDATE
  USING (tenant_id = auth.current_tenant_id() AND auth.is_admin())
  WITH CHECK (tenant_id = auth.current_tenant_id() AND auth.is_admin());

-- Pengguna dapat update profil mereka sendiri (kecuali role dan tenant)
CREATE POLICY "Pengguna dapat update profil sendiri"
  ON pengguna FOR UPDATE
  USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid() AND tenant_id = auth.current_tenant_id());

-- ============================================================================
-- RLS POLICIES - KURSUS
-- ============================================================================

-- Pengguna dapat melihat kursus published di tenant mereka
CREATE POLICY "Pengguna dapat melihat kursus published"
  ON kursus FOR SELECT
  USING (
    tenant_id = auth.current_tenant_id() AND 
    (status = 'published' OR instruktur_id IN (
      SELECT id FROM pengguna WHERE auth_id = auth.uid()
    ) OR auth.is_admin())
  );

-- Admin dan Instruktur dapat membuat kursus
CREATE POLICY "Admin dan Instruktur dapat membuat kursus"
  ON kursus FOR INSERT
  WITH CHECK (
    tenant_id = auth.current_tenant_id() AND 
    auth.current_user_role() IN ('superadmin', 'admin', 'instruktur')
  );

-- Instruktur dapat update kursus mereka, Admin dapat update semua
CREATE POLICY "Instruktur dapat update kursus mereka"
  ON kursus FOR UPDATE
  USING (
    tenant_id = auth.current_tenant_id() AND 
    (instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR auth.is_admin())
  )
  WITH CHECK (
    tenant_id = auth.current_tenant_id() AND 
    (instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR auth.is_admin())
  );

-- Instruktur dapat delete kursus mereka, Admin dapat delete semua
CREATE POLICY "Instruktur dapat delete kursus mereka"
  ON kursus FOR DELETE
  USING (
    tenant_id = auth.current_tenant_id() AND 
    (instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR auth.is_admin())
  );

-- ============================================================================
-- RLS POLICIES - MODUL
-- ============================================================================

-- Pengguna dapat melihat modul dari kursus yang bisa mereka akses
CREATE POLICY "Pengguna dapat melihat modul"
  ON modul FOR SELECT
  USING (
    kursus_id IN (
      SELECT id FROM kursus WHERE tenant_id = auth.current_tenant_id()
    )
  );

-- Instruktur dapat manage modul di kursus mereka
CREATE POLICY "Instruktur dapat manage modul"
  ON modul FOR ALL
  USING (
    kursus_id IN (
      SELECT id FROM kursus 
      WHERE tenant_id = auth.current_tenant_id() AND 
      (instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR auth.is_admin())
    )
  )
  WITH CHECK (
    kursus_id IN (
      SELECT id FROM kursus 
      WHERE tenant_id = auth.current_tenant_id() AND 
      (instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR auth.is_admin())
    )
  );

-- ============================================================================
-- RLS POLICIES - MATERI
-- ============================================================================

-- Pengguna dapat melihat materi dari kursus yang bisa mereka akses
CREATE POLICY "Pengguna dapat melihat materi"
  ON materi FOR SELECT
  USING (
    modul_id IN (
      SELECT m.id FROM modul m
      JOIN kursus k ON m.kursus_id = k.id
      WHERE k.tenant_id = auth.current_tenant_id()
    )
  );

-- Instruktur dapat manage materi di kursus mereka
CREATE POLICY "Instruktur dapat manage materi"
  ON materi FOR ALL
  USING (
    modul_id IN (
      SELECT m.id FROM modul m
      JOIN kursus k ON m.kursus_id = k.id
      WHERE k.tenant_id = auth.current_tenant_id() AND 
      (k.instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR auth.is_admin())
    )
  )
  WITH CHECK (
    modul_id IN (
      SELECT m.id FROM modul m
      JOIN kursus k ON m.kursus_id = k.id
      WHERE k.tenant_id = auth.current_tenant_id() AND 
      (k.instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR auth.is_admin())
    )
  );

-- ============================================================================
-- RLS POLICIES - ENROLLMENT
-- ============================================================================

-- Pengguna dapat melihat enrollment mereka sendiri
CREATE POLICY "Pengguna dapat melihat enrollment sendiri"
  ON enrollment FOR SELECT
  USING (
    pengguna_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR
    kursus_id IN (
      SELECT id FROM kursus 
      WHERE instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid())
    ) OR
    auth.is_admin()
  );

-- Pembelajar dapat enroll ke kursus
CREATE POLICY "Pembelajar dapat enroll"
  ON enrollment FOR INSERT
  WITH CHECK (
    pengguna_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) AND
    kursus_id IN (SELECT id FROM kursus WHERE tenant_id = auth.current_tenant_id() AND status = 'published')
  );

-- Admin dan Instruktur dapat manage enrollment
CREATE POLICY "Admin dapat manage enrollment"
  ON enrollment FOR ALL
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

-- Pengguna dapat update enrollment mereka sendiri (untuk progress)
CREATE POLICY "Pengguna dapat update enrollment sendiri"
  ON enrollment FOR UPDATE
  USING (pengguna_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()))
  WITH CHECK (pengguna_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()));

-- ============================================================================
-- RLS POLICIES - PROGRESS
-- ============================================================================

-- Pengguna dapat melihat progress mereka sendiri
CREATE POLICY "Pengguna dapat melihat progress sendiri"
  ON progress FOR SELECT
  USING (
    pengguna_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR
    auth.is_admin() OR
    enrollment_id IN (
      SELECT e.id FROM enrollment e
      JOIN kursus k ON e.kursus_id = k.id
      WHERE k.instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid())
    )
  );

-- Pengguna dapat create/update progress mereka sendiri
CREATE POLICY "Pengguna dapat manage progress sendiri"
  ON progress FOR ALL
  USING (pengguna_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()))
  WITH CHECK (pengguna_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()));

-- ============================================================================
-- RLS POLICIES - ASESMEN
-- ============================================================================

-- Pengguna dapat melihat asesmen dari kursus yang bisa mereka akses
CREATE POLICY "Pengguna dapat melihat asesmen"
  ON asesmen FOR SELECT
  USING (
    kursus_id IN (
      SELECT id FROM kursus WHERE tenant_id = auth.current_tenant_id()
    )
  );

-- Instruktur dapat manage asesmen di kursus mereka
CREATE POLICY "Instruktur dapat manage asesmen"
  ON asesmen FOR ALL
  USING (
    kursus_id IN (
      SELECT id FROM kursus 
      WHERE tenant_id = auth.current_tenant_id() AND 
      (instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR auth.is_admin())
    )
  )
  WITH CHECK (
    kursus_id IN (
      SELECT id FROM kursus 
      WHERE tenant_id = auth.current_tenant_id() AND 
      (instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR auth.is_admin())
    )
  );

-- ============================================================================
-- RLS POLICIES - SOAL
-- ============================================================================

-- Pengguna dapat melihat soal dari asesmen yang bisa mereka akses
CREATE POLICY "Pengguna dapat melihat soal"
  ON soal FOR SELECT
  USING (
    asesmen_id IN (
      SELECT a.id FROM asesmen a
      JOIN kursus k ON a.kursus_id = k.id
      WHERE k.tenant_id = auth.current_tenant_id()
    )
  );

-- Instruktur dapat manage soal di asesmen mereka
CREATE POLICY "Instruktur dapat manage soal"
  ON soal FOR ALL
  USING (
    asesmen_id IN (
      SELECT a.id FROM asesmen a
      JOIN kursus k ON a.kursus_id = k.id
      WHERE k.tenant_id = auth.current_tenant_id() AND 
      (k.instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR auth.is_admin())
    )
  )
  WITH CHECK (
    asesmen_id IN (
      SELECT a.id FROM asesmen a
      JOIN kursus k ON a.kursus_id = k.id
      WHERE k.tenant_id = auth.current_tenant_id() AND 
      (k.instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR auth.is_admin())
    )
  );

-- ============================================================================
-- RLS POLICIES - PERCOBAAN ASESMEN
-- ============================================================================

-- Pengguna dapat melihat percobaan mereka sendiri
CREATE POLICY "Pengguna dapat melihat percobaan sendiri"
  ON percobaan_asesmen FOR SELECT
  USING (
    pengguna_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR
    auth.is_admin() OR
    asesmen_id IN (
      SELECT a.id FROM asesmen a
      JOIN kursus k ON a.kursus_id = k.id
      WHERE k.instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid())
    )
  );

-- Pembelajar dapat membuat percobaan
CREATE POLICY "Pembelajar dapat membuat percobaan"
  ON percobaan_asesmen FOR INSERT
  WITH CHECK (pengguna_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()));

-- Pengguna dapat update percobaan mereka sendiri
CREATE POLICY "Pengguna dapat update percobaan sendiri"
  ON percobaan_asesmen FOR UPDATE
  USING (pengguna_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()))
  WITH CHECK (pengguna_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()));

-- ============================================================================
-- RLS POLICIES - JAWABAN
-- ============================================================================

-- Pengguna dapat melihat jawaban mereka sendiri
CREATE POLICY "Pengguna dapat melihat jawaban sendiri"
  ON jawaban FOR SELECT
  USING (
    percobaan_id IN (
      SELECT id FROM percobaan_asesmen 
      WHERE pengguna_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid())
    ) OR
    auth.is_admin() OR
    percobaan_id IN (
      SELECT pa.id FROM percobaan_asesmen pa
      JOIN asesmen a ON pa.asesmen_id = a.id
      JOIN kursus k ON a.kursus_id = k.id
      WHERE k.instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid())
    )
  );

-- Pembelajar dapat submit jawaban
CREATE POLICY "Pembelajar dapat submit jawaban"
  ON jawaban FOR INSERT
  WITH CHECK (
    percobaan_id IN (
      SELECT id FROM percobaan_asesmen 
      WHERE pengguna_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid())
    )
  );

-- Pengguna dapat update jawaban mereka (untuk auto-save)
CREATE POLICY "Pengguna dapat update jawaban sendiri"
  ON jawaban FOR UPDATE
  USING (
    percobaan_id IN (
      SELECT id FROM percobaan_asesmen 
      WHERE pengguna_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid())
    )
  )
  WITH CHECK (
    percobaan_id IN (
      SELECT id FROM percobaan_asesmen 
      WHERE pengguna_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid())
    )
  );

-- Instruktur dapat update jawaban untuk grading
CREATE POLICY "Instruktur dapat grade jawaban"
  ON jawaban FOR UPDATE
  USING (
    percobaan_id IN (
      SELECT pa.id FROM percobaan_asesmen pa
      JOIN asesmen a ON pa.asesmen_id = a.id
      JOIN kursus k ON a.kursus_id = k.id
      WHERE k.instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR auth.is_admin()
    )
  )
  WITH CHECK (
    percobaan_id IN (
      SELECT pa.id FROM percobaan_asesmen pa
      JOIN asesmen a ON pa.asesmen_id = a.id
      JOIN kursus k ON a.kursus_id = k.id
      WHERE k.instruktur_id IN (SELECT id FROM pengguna WHERE auth_id = auth.uid()) OR auth.is_admin()
    )
  );
