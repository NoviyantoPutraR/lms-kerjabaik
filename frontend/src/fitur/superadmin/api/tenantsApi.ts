import { supabase } from "@/pustaka/supabase";
import type {
  TenantWithStats,
  TenantFormData,
  TenantFilters,
  TenantStats,
} from "../tipe/tenant.types";

/**
 * Get list of all tenants with optional filters
 */
export async function getTenants(filters?: TenantFilters) {
  let query = supabase
    .from("lembaga")
    .select(
      `
      *,
      pengguna:pengguna(count),
      kursus:kursus(count)
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  // Apply filters
  if (filters?.search) {
    query = query.or(
      `nama.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`,
    );
  }

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.tipe) {
    query = query.eq("tipe", filters.tipe);
  }

  // Pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  // Transform data to include counts
  const tenants: TenantWithStats[] =
    data?.map((tenant: any) => ({
      ...tenant,
      user_count: tenant.pengguna?.[0]?.count || 0,
      course_count: tenant.kursus?.[0]?.count || 0,
    })) || [];

  return {
    data: tenants,
    count: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Get single tenant by ID
 */
export async function getTenant(id: string) {
  const { data, error } = await supabase
    .from("lembaga")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get tenant statistics
 */
export async function getTenantStats(tenantId: string): Promise<TenantStats> {
  // Get user counts
  const { count: totalUsers } = await supabase
    .from("pengguna")
    .select("*", { count: "exact", head: true })
    .eq("id_lembaga", tenantId);

  const { count: activeUsers } = await supabase
    .from("pengguna")
    .select("*", { count: "exact", head: true })
    .eq("id_lembaga", tenantId)
    .eq("status", "aktif");

  // Get course counts
  const { count: totalCourses } = await supabase
    .from("kursus")
    .select("*", { count: "exact", head: true })
    .eq("id_lembaga", tenantId);

  const { count: publishedCourses } = await supabase
    .from("kursus")
    .select("*", { count: "exact", head: true })
    .eq("id_lembaga", tenantId)
    .eq("status", "published");

  // Get enrollment count
  const { count: totalEnrollments } = await supabase
    .from("pendaftaran_kursus")
    .select("*, kursus!inner(*)", { count: "exact", head: true })
    .eq("kursus.id_lembaga", tenantId);

  // TODO: Calculate storage used (implement later)
  const storageUsedMb = 0;

  return {
    total_users: totalUsers || 0,
    active_users: activeUsers || 0,
    total_courses: totalCourses || 0,
    published_courses: publishedCourses || 0,
    total_enrollments: totalEnrollments || 0,
    storage_used_mb: storageUsedMb,
  };
}

/**
 * Create new tenant
 */
export async function createTenant(data: TenantFormData) {
  const { data: tenant, error } = (await (supabase.from("lembaga") as any)
    .insert({
      nama: data.nama,
      slug: data.slug,
      tipe: data.tipe,
      status: data.status,
      url_logo: data.url_logo || null,
      konfigurasi: data.konfigurasi || {},
    })
    .select()
    .single()) as { data: any | null, error: any };

  if (error) throw error;
  return tenant;
}

/**
 * Update existing tenant
 */
export async function updateTenant(id: string, data: Partial<TenantFormData>) {
  const { data: tenant, error } = (await (supabase.from("lembaga") as any)
    .update({
      nama: data.nama,
      slug: data.slug,
      tipe: data.tipe,
      status: data.status,
      url_logo: data.url_logo,
      konfigurasi: data.konfigurasi,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()) as { data: any | null, error: any };

  if (error) throw error;
  return tenant;
}

/**
 * Delete tenant
 */
export async function deleteTenant(id: string) {
  const { error } = await supabase.from("lembaga").delete().eq("id", id);

  if (error) throw error;
}

/**
 * Check if slug is available
 */
export async function checkSlugAvailability(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  let query = supabase
    .from("lembaga")
    .select("id", { count: "exact", head: true })
    .eq("slug", slug);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { count, error } = await query;

  if (error) throw error;
  return (count || 0) === 0;
}
