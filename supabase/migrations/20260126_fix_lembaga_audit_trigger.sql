-- Perbaikan Trigger Audit Lembaga
-- Mengatasi error relation "audit_logs" does not exist

BEGIN;

-- Hapus trigger lama yang merujuk ke fungsi usang
DROP TRIGGER IF EXISTS tenant_audit_trigger ON lembaga;

-- Buat fungsi baru dengan penamaan Bahasa Indonesia
CREATE OR REPLACE FUNCTION public.log_perubahan_lembaga()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO log_audit (aksi, tipe_sumber_daya, id_sumber_daya, detail)
    VALUES ('BUAT', 'lembaga', NEW.id, row_to_json(NEW)::jsonb);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO log_audit (aksi, tipe_sumber_daya, id_sumber_daya, detail)
    VALUES ('UBAH', 'lembaga', NEW.id, jsonb_build_object(
      'lama', row_to_json(OLD)::jsonb,
      'baru', row_to_json(NEW)::jsonb
    ));
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO log_audit (aksi, tipe_sumber_daya, id_sumber_daya, detail)
    VALUES ('HAPUS', 'lembaga', OLD.id, row_to_json(OLD)::jsonb);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Pasang trigger baru yang menggunakan fungsi baru
CREATE TRIGGER trigger_audit_lembaga
  AFTER INSERT OR UPDATE OR DELETE ON lembaga
  FOR EACH ROW
  EXECUTE FUNCTION log_perubahan_lembaga();

COMMIT;
