import { supabase } from "@/pustaka/supabase";
import type {
  AuditLogInsert,
  AuditLogFilters,
  AuditLogWithUser,
} from "../tipe/auditLog.types";

/**
 * Get audit logs with optional filters
 */
export async function getAuditLogs(filters?: AuditLogFilters) {
  // Determine if we need an inner join for role filtering
  const penggunaJoin = filters?.role ? "pengguna:id_pengguna!inner" : "pengguna:id_pengguna";

  let query = supabase
    .from("log_audit")
    .select(
      `
      *,
      ${penggunaJoin} (
        id,
        nama_lengkap,
        email,
        role
      ),
      tenant:id_lembaga (
        id,
        nama
      )
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  // Apply filters
  if (filters?.id_pengguna) {
    query = query.eq("id_pengguna", filters.id_pengguna);
  }

  if (filters?.id_lembaga) {
    query = query.eq("id_lembaga", filters.id_lembaga);
  }

  if (filters?.aksi) {
    query = query.eq("aksi", filters.aksi);
  }

  if (filters?.tipe_sumber_daya) {
    query = query.eq("tipe_sumber_daya", filters.tipe_sumber_daya);
  }

  if (filters?.date_from) {
    query = query.gte("created_at", filters.date_from);
  }

  if (filters?.date_to) {
    query = query.lte("created_at", filters.date_to);
  }

  if (filters?.role) {
    query = query.eq("pengguna.role", filters.role);
  }

  // Pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 50;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  // Transform data to include user and tenant names
  const logs: AuditLogWithUser[] =
    data?.map((log: any) => ({
      ...log,
      nama_pengguna: log.pengguna?.nama_lengkap,
      email_pengguna: log.pengguna?.email,
      role: log.pengguna?.role,
      nama_lembaga: log.tenant?.nama,
    })) || [];

  return {
    data: logs,
    count: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Create audit log entry
 */
export async function createAuditLog(data: AuditLogInsert) {
  const { data: log, error } = (await (supabase.from("log_audit") as any)
    .insert({
      id_pengguna: data.id_pengguna || null,
      id_lembaga: data.id_lembaga || null,
      aksi: data.aksi,
      tipe_sumber_daya: data.tipe_sumber_daya,
      id_sumber_daya: data.id_sumber_daya || null,
      detail: data.detail || {},
      alamat_ip: data.alamat_ip || null,
      agen_pengguna: data.agen_pengguna || null,
    })
    .select()
    .single()) as { data: any | null, error: any };

  if (error) throw error;
  return log;
}

/**
 * Get recent activity (last 100 logs)
 */
export async function getRecentActivity(limit: number = 100) {
  const { data, error } = await supabase
    .from("log_audit")
    .select(
      `
      *,
      pengguna:id_pengguna (
        id,
        nama_lengkap,
        email
      ),
      tenant:id_lembaga (
        id,
        nama
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data?.map((log: any) => ({
    ...log,
    nama_pengguna: log.pengguna?.nama_lengkap,
    email_pengguna: log.pengguna?.email,
    nama_lembaga: log.tenant?.nama,
  }));
}

/**
 * Get activity summary by aksi type
 */
export async function getActivitySummary(days: number = 30) {
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);

  const { data, error } = await supabase
    .from("log_audit")
    .select("aksi")
    .gte("created_at", dateFrom.toISOString());

  if (error) throw error;

  // Count by aksi type
  const summary: Record<string, number> = {};
  ((data as any[]) || []).forEach((log) => {
    summary[log.aksi] = (summary[log.aksi] || 0) + 1;
  });

  return summary;
}
