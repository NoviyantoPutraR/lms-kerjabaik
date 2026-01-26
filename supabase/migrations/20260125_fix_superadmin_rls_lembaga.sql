-- ============================================================================
-- Fix RLS Policies for Superadmin - Allow full access to lembaga table
-- ============================================================================
-- Migration: 20260125_fix_superadmin_rls_lembaga
-- Description: Fix RLS policies to allow superadmin to insert/update/delete lembaga
-- ============================================================================

BEGIN;

-- Enable RLS on lembaga table (if not already enabled)
ALTER TABLE lembaga ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies on lembaga
DROP POLICY IF EXISTS "Superadmin dapat melihat semua lembaga" ON lembaga;
DROP POLICY IF EXISTS "Superadmin dapat membuat lembaga" ON lembaga;
DROP POLICY IF EXISTS "Superadmin dapat mengupdate lembaga" ON lembaga;
DROP POLICY IF EXISTS "Superadmin dapat menghapus lembaga" ON lembaga;
DROP POLICY IF EXISTS "Admin dapat melihat lembaga mereka" ON lembaga;

-- Create comprehensive policies for superadmin
CREATE POLICY "Superadmin dapat melihat semua lembaga" ON lembaga
  FOR SELECT USING (
    cek_apakah_superadmin()
  );

CREATE POLICY "Superadmin dapat membuat lembaga" ON lembaga
  FOR INSERT WITH CHECK (
    cek_apakah_superadmin()
  );

CREATE POLICY "Superadmin dapat mengupdate lembaga" ON lembaga
  FOR UPDATE USING (
    cek_apakah_superadmin()
  );

CREATE POLICY "Superadmin dapat menghapus lembaga" ON lembaga
  FOR DELETE USING (
    cek_apakah_superadmin()
  );

COMMIT;
