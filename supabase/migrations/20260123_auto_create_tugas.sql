-- ============================================================================
-- Auto Create Tugas Record untuk Assessment Tipe Tugas
-- ============================================================================
-- Migration: 20260123_auto_create_tugas
-- Description: Trigger untuk otomatis membuat record tugas saat assessment tipe tugas dibuat
-- ============================================================================

-- Function untuk auto-create tugas
CREATE OR REPLACE FUNCTION auto_create_tugas_for_assessment()
RETURNS TRIGGER AS $$
BEGIN
    -- Jika assessment bertipe 'tugas', buat record tugas
    IF NEW.tipe = 'tugas' THEN
        INSERT INTO tugas (
            asesmen_id,
            judul,
            deskripsi,
            deadline,
            max_file_size,
            allowed_extensions
        ) VALUES (
            NEW.id,
            NEW.judul,
            NEW.deskripsi,
            -- Deadline default 7 hari dari sekarang (bisa diubah nanti)
            NOW() + INTERVAL '7 days',
            10485760,  -- 10MB default
            ARRAY['pdf', 'doc', 'docx', 'ppt', 'pptx']
        )
        ON CONFLICT DO NOTHING;  -- Jika sudah ada, skip
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk auto-create tugas setelah assessment dibuat
DROP TRIGGER IF EXISTS trigger_auto_create_tugas ON asesmen;
CREATE TRIGGER trigger_auto_create_tugas
    AFTER INSERT ON asesmen
    FOR EACH ROW
    EXECUTE FUNCTION auto_create_tugas_for_assessment();

-- Update existing assessments yang tipe tugas tapi belum punya record tugas
INSERT INTO tugas (
    asesmen_id,
    judul,
    deskripsi,
    deadline,
    max_file_size,
    allowed_extensions
)
SELECT 
    a.id,
    a.judul,
    a.deskripsi,
    NOW() + INTERVAL '7 days',
    10485760,
    ARRAY['pdf', 'doc', 'docx', 'ppt', 'pptx']
FROM asesmen a
LEFT JOIN tugas t ON t.asesmen_id = a.id
WHERE a.tipe = 'tugas' AND t.id IS NULL
ON CONFLICT DO NOTHING;

COMMENT ON FUNCTION auto_create_tugas_for_assessment IS 'Auto-create record tugas saat assessment tipe tugas dibuat';
