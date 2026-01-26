-- ============================================================================
-- Update status constraint for pengumpulan_tugas
-- ============================================================================

-- Drop old constraint
ALTER TABLE pengumpulan_tugas 
DROP CONSTRAINT IF EXISTS pengumpulan_tugas_status_check;

-- Add new constraint with 'perlu_revisi' and 'ditolak'
ALTER TABLE pengumpulan_tugas 
ADD CONSTRAINT pengumpulan_tugas_status_check 
CHECK (status IN ('dikumpulkan', 'dinilai', 'perlu_revisi', 'ditolak'));

COMMENT ON COLUMN pengumpulan_tugas.status IS 'Status pengumpulan: dikumpulkan, dinilai, perlu_revisi, ditolak';
