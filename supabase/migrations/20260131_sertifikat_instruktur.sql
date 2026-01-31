-- ============================================================================
-- LMS - Tambahkan Akses Instruktur ke Sertifikat
-- ============================================================================
-- Migration: 20260131_sertifikat_instruktur
-- Description: Mengizinkan instruktur untuk melihat sertifikat siswa di kursus yang mereka ajar
-- ============================================================================

BEGIN;

-- 1. Tambahkan Kebijakan RLS agar Instruktur dapat melihat sertifikat siswa di kursusnya
DROP POLICY IF EXISTS "Instruktur dapat melihat sertifikat di kursus mereka" ON sertifikat;
CREATE POLICY "Instruktur dapat melihat sertifikat di kursus mereka" 
ON sertifikat FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM kursus k 
    WHERE k.id = sertifikat.id_kursus 
    AND k.id_instruktur = (SELECT p.id FROM pengguna p WHERE p.auth_id = auth.uid())
  )
);

COMMIT;
