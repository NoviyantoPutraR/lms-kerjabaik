-- ============================================================================
-- Rename tenant table to lembaga (Indonesian naming)
-- ============================================================================
-- Migration: 20260125_rename_tenant_to_lembaga
-- Description: Rename 'tenant' table to 'lembaga' for consistency with Indonesian schema
-- ============================================================================

BEGIN;

-- 1. Drop existing triggers that reference 'tenant' table
DROP TRIGGER IF EXISTS update_tenant_updated_at ON tenant;

-- 2. Rename the table
ALTER TABLE tenant RENAME TO lembaga;

-- 3. Recreate trigger with new table name
CREATE TRIGGER update_lembaga_updated_at BEFORE UPDATE ON lembaga
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Update foreign key references in other tables
-- Note: Column names 'tenant_id' have already been renamed to 'id_lembaga' in previous migrations

-- 5. Update RLS policies that reference the table
-- Drop old policies (they were created on 'tenant' table)
DROP POLICY IF EXISTS "Superadmin can view all tenants" ON lembaga;
DROP POLICY IF EXISTS "Superadmin can create tenants" ON lembaga;
DROP POLICY IF EXISTS "Superadmin can update tenants" ON lembaga;
DROP POLICY IF EXISTS "Superadmin can delete tenants" ON lembaga;

-- Create new policies for 'lembaga' table
CREATE POLICY "Superadmin dapat melihat semua lembaga" ON lembaga
  FOR SELECT USING (cek_apakah_superadmin());

CREATE POLICY "Superadmin dapat membuat lembaga" ON lembaga
  FOR INSERT WITH CHECK (cek_apakah_superadmin());

CREATE POLICY "Superadmin dapat mengupdate lembaga" ON lembaga
  FOR UPDATE USING (cek_apakah_superadmin());

CREATE POLICY "Superadmin dapat menghapus lembaga" ON lembaga
  FOR DELETE USING (cek_apakah_superadmin());

-- Update references in functions/views if any
-- Note: No views reference 'tenant' table directly

COMMIT;

-- Verification
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'lembaga';
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'tenant'; -- Should return no rows
