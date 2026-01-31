-- ============================================================================
-- Fitur: Zoom Session Management
-- Description: Tabel untuk mengelola jadwal sesi live Zoom per kursus.
-- ============================================================================

-- 1. Tabel sesi_zoom
CREATE TABLE IF NOT EXISTS sesi_zoom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_lembaga UUID REFERENCES lembaga(id) ON DELETE CASCADE,
  id_kursus UUID REFERENCES kursus(id) ON DELETE CASCADE,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  tautan_zoom TEXT NOT NULL,
  waktu_mulai TIMESTAMPTZ NOT NULL,
  durasi_menit INTEGER DEFAULT 60,
  recording_url TEXT,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index untuk performa
CREATE INDEX idx_sesi_zoom_lembaga ON sesi_zoom(id_lembaga);
CREATE INDEX idx_sesi_zoom_kursus ON sesi_zoom(id_kursus);
CREATE INDEX idx_sesi_zoom_waktu ON sesi_zoom(waktu_mulai);

-- 3. Trigger auto update updated_at
CREATE TRIGGER update_sesi_zoom_updated_at BEFORE UPDATE ON sesi_zoom
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Enable Row Level Security
ALTER TABLE sesi_zoom ENABLE ROW LEVEL SECURITY;

-- 5. Kebijakan RLS (Policies)

-- A. Admin & Superadmin: Akses penuh dalam lembaga yang sama
CREATE POLICY "Admin & Superadmin: Manage Zoom Sessions" ON sesi_zoom
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pengguna p
      WHERE p.auth_id = auth.uid()
      AND p.id_lembaga = sesi_zoom.id_lembaga
      AND p.role IN ('superadmin', 'admin')
    )
  );

-- B. Instruktur: Manage sesi untuk kursus miliknya sendiri
CREATE POLICY "Instruktur: Manage own Course Zoom Sessions" ON sesi_zoom
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM kursus k
      JOIN pengguna p ON k.id_instruktur = p.id
      WHERE k.id = sesi_zoom.id_kursus
      AND p.auth_id = auth.uid()
      AND p.role = 'instruktur'
    )
  );

-- C. Pembelajar: Melihat sesi jika terdaftar (Enrollment Aktif)
CREATE POLICY "Pembelajar: View sessions if enrolled" ON sesi_zoom
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pendaftaran_kursus pk
      JOIN pengguna p ON pk.id_pengguna = p.id
      WHERE pk.id_kursus = sesi_zoom.id_kursus
      AND p.auth_id = auth.uid()
      AND pk.status = 'aktif'
      AND p.role = 'pembelajar'
      AND sesi_zoom.status = 'published'
    )
  );

