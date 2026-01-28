export interface AuditLog {
  id: string;
  id_pengguna: string | null;
  id_lembaga: string | null;
  aksi: string;
  tipe_sumber_daya: string;
  id_sumber_daya: string | null;
  detail: Record<string, any>;
  alamat_ip: string | null;
  agen_pengguna: string | null;
  created_at: string;
}

export interface AuditLogInsert {
  id_pengguna?: string;
  id_lembaga?: string;
  aksi: string;
  tipe_sumber_daya: string;
  id_sumber_daya?: string;
  detail?: Record<string, any>;
  alamat_ip?: string;
  agen_pengguna?: string;
}

export interface AuditLogFilters {
  id_pengguna?: string;
  id_lembaga?: string;
  aksi?: string;
  tipe_sumber_daya?: string;
  date_from?: string;
  date_to?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogWithUser extends AuditLog {
  nama_pengguna?: string;
  email_pengguna?: string;
  role?: string;
  nama_lembaga?: string;
}
