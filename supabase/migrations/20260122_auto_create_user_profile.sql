-- ============================================================================
-- Auto Create User Profile on Signup
-- ============================================================================
-- Migration: 20260122_auto_create_user_profile
-- Description: Membuat trigger untuk otomatis membuat entry di tabel pengguna
--              saat user baru signup melalui Supabase Auth
-- ============================================================================

-- 1. Function untuk handle user baru
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  -- Tenant ID yang digunakan untuk testing/demo
  default_tenant_id UUID := '51c8d4a4-f79f-45a1-8b21-cd76a358452e'::uuid;
  user_full_name TEXT;
  user_role TEXT;
BEGIN
  -- Ambil data dari metadata
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'User');
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'pembelajar');

  -- Insert ke tabel pengguna
  INSERT INTO public.pengguna (
    tenant_id,
    auth_id,
    email,
    nama_lengkap,
    role,
    status
  )
  VALUES (
    default_tenant_id,
    NEW.id,
    NEW.email,
    user_full_name,
    user_role,
    'aktif'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger yang dipanggil saat user baru dibuat di auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.pengguna TO anon, authenticated;
