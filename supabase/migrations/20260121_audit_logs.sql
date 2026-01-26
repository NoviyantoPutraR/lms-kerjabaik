-- Migration: Audit Logs Table
-- Description: Tabel untuk mencatat semua aktivitas penting dalam sistem untuk audit trail

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES pengguna(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES tenant(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Superadmin can view all logs
CREATE POLICY "Superadmin can view all audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pengguna
      WHERE pengguna.auth_id = auth.uid()
      AND pengguna.role = 'superadmin'
    )
  );

-- RLS Policy: Superadmin can insert logs
CREATE POLICY "Superadmin can insert audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pengguna
      WHERE pengguna.auth_id = auth.uid()
      AND pengguna.role = 'superadmin'
    )
  );

-- RLS Policy: Admin can view logs for their tenant
CREATE POLICY "Admin can view their tenant logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pengguna
      WHERE pengguna.auth_id = auth.uid()
      AND pengguna.role = 'admin'
      AND pengguna.tenant_id = audit_logs.tenant_id
    )
  );

-- Function to automatically log tenant changes
CREATE OR REPLACE FUNCTION log_tenant_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO audit_logs (action, resource_type, resource_id, details)
    VALUES ('CREATE', 'tenant', NEW.id, row_to_json(NEW)::jsonb);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO audit_logs (action, resource_type, resource_id, details)
    VALUES ('UPDATE', 'tenant', NEW.id, jsonb_build_object(
      'old', row_to_json(OLD)::jsonb,
      'new', row_to_json(NEW)::jsonb
    ));
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_logs (action, resource_type, resource_id, details)
    VALUES ('DELETE', 'tenant', OLD.id, row_to_json(OLD)::jsonb);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for tenant changes
CREATE TRIGGER tenant_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON tenant
  FOR EACH ROW
  EXECUTE FUNCTION log_tenant_changes();

-- Comment on table
COMMENT ON TABLE audit_logs IS 'Audit trail untuk semua aktivitas penting dalam sistem';
COMMENT ON COLUMN audit_logs.action IS 'Jenis aksi: CREATE, UPDATE, DELETE, LOGIN, LOGOUT, IMPERSONATE, dll';
COMMENT ON COLUMN audit_logs.resource_type IS 'Tipe resource: tenant, pengguna, kursus, dll';
COMMENT ON COLUMN audit_logs.resource_id IS 'ID dari resource yang diakses';
COMMENT ON COLUMN audit_logs.details IS 'Detail tambahan dalam format JSON';
