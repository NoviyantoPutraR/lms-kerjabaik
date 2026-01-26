-- ============================================================================
-- Add Enrollment Policy to Kursus Table
-- ============================================================================
-- Migration: 20260122_add_enrollment_policy
-- Description: Menambahkan kolom enrollment_policy untuk mengatur cara peserta masuk kursus
-- ============================================================================

-- Tambah kolom enrollment_policy ke tabel kursus
ALTER TABLE kursus
ADD COLUMN enrollment_policy VARCHAR(50) DEFAULT 'self_enrollment'
CHECK (enrollment_policy IN ('self_enrollment', 'admin_approval', 'auto_enrollment'));

-- Update existing records dengan default value
UPDATE kursus
SET enrollment_policy = 'self_enrollment'
WHERE enrollment_policy IS NULL;

-- Tambah index untuk performa query berdasarkan enrollment policy
CREATE INDEX idx_kursus_enrollment_policy ON kursus(enrollment_policy);

-- Tambah comment untuk dokumentasi
COMMENT ON COLUMN kursus.enrollment_policy IS 'Kebijakan enrollment: self_enrollment (pendaftaran mandiri), admin_approval (perlu persetujuan admin), auto_enrollment (otomatis untuk semua user di tenant)';
