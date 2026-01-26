-- ============================================================================
-- Storage Bucket Configuration for Assignments
-- ============================================================================
-- Migration: 20260123_storage_bucket_config
-- Description: Configure storage bucket untuk tugas dengan security restrictions
-- ============================================================================

-- NOTE: Bucket 'assignments' harus sudah dibuat manual di Supabase Dashboard
-- Panduan ada di file: STORAGE_SETUP_GUIDE.md

-- Update bucket configuration (jika ada permission)
-- Jika error, lakukan manual via Supabase Dashboard
DO $$
BEGIN
    UPDATE storage.buckets
    SET 
        public = false,
        file_size_limit = 10485760,  -- 10MB
        allowed_mime_types = ARRAY[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ]
    WHERE name = 'assignments';
EXCEPTION
    WHEN insufficient_privilege THEN
        RAISE NOTICE 'Insufficient privilege to update bucket. Please update manually via Supabase Dashboard.';
END $$;

-- Storage policies harus dibuat manual via Supabase Dashboard
-- Lihat STORAGE_SETUP_GUIDE.md untuk instruksi lengkap

COMMENT ON SCHEMA storage IS 'Storage bucket untuk file tugas mahasiswa. Lihat STORAGE_SETUP_GUIDE.md untuk setup.';
