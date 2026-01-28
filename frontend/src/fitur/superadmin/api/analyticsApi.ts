import { supabase } from "@/pustaka/supabase";
import type {
  PlatformOverview,
  TenantAnalytics,
  GrowthMetrics,
  AnalyticsFilters,
} from "../tipe/analytics.types";

/**
 * Get platform overview statistics
 */
export async function getPlatformOverview(): Promise<PlatformOverview> {
  // Get tenant counts
  const { count: totalTenants } = await supabase
    .from("lembaga")
    .select("*", { count: "exact", head: true });

  const { count: activeTenants } = await supabase
    .from("lembaga")
    .select("*", { count: "exact", head: true })
    .eq("status", "aktif");

  // Get user counts
  const { count: totalUsers } = await supabase
    .from("pengguna")
    .select("*", { count: "exact", head: true });

  // Get active users today (updated_at within last 24 hours)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const { count: activeUsersToday } = await supabase
    .from("pengguna")
    .select("*", { count: "exact", head: true })
    .gte("updated_at", yesterday.toISOString());

  // Get course count
  const { count: totalCourses } = await supabase
    .from("kursus")
    .select("*", { count: "exact", head: true });

  // Get enrollment count
  const { count: totalEnrollments } = await supabase
    .from("pendaftaran_kursus")
    .select("*", { count: "exact", head: true });

  // TODO: Calculate total storage used
  const storageUsedGb = 0;

  return {
    total_tenants: totalTenants || 0,
    active_tenants: activeTenants || 0,
    total_users: totalUsers || 0,
    active_users_today: activeUsersToday || 0,
    total_courses: totalCourses || 0,
    total_enrollments: totalEnrollments || 0,
    storage_used_gb: storageUsedGb,
  };
}

/**
 * Get analytics for all tenants
 */
export async function getTenantAnalytics(
  _filters?: AnalyticsFilters,
): Promise<TenantAnalytics[]> {
  // Get all tenants
  const { data: tenants, error: tenantsError } = (await supabase
    .from("lembaga")
    .select("id, nama")
    .order("nama")) as { data: { id: string, nama: string }[] | null, error: any };

  if (tenantsError) throw tenantsError;

  // Get stats for each tenant
  const analytics: TenantAnalytics[] = await Promise.all(
    (tenants || []).map(async (tenant) => {
      const { count: userCount } = await supabase
        .from("pengguna")
        .select("*", { count: "exact", head: true })
        .eq("id_lembaga", tenant.id);

      const { count: courseCount } = await supabase
        .from("kursus")
        .select("*", { count: "exact", head: true })
        .eq("id_lembaga", tenant.id);

      const { count: enrollmentCount } = await supabase
        .from("pendaftaran_kursus")
        .select("*, kursus!inner(*)", { count: "exact", head: true })
        .eq("kursus.id_lembaga", tenant.id);

      // Active users in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: activeUsers30d } = await supabase
        .from("pengguna")
        .select("*", { count: "exact", head: true })
        .eq("id_lembaga", tenant.id)
        .gte("updated_at", thirtyDaysAgo.toISOString());

      return {
        id_lembaga: tenant.id,
        tenant_name: tenant.nama,
        user_count: userCount || 0,
        course_count: courseCount || 0,
        enrollment_count: enrollmentCount || 0,
        active_users_30d: activeUsers30d || 0,
        storage_used_mb: 0, // TODO: implement
      };
    }),
  );

  return analytics;
}

/**
 * Get growth metrics over time
 */
export async function getGrowthMetrics(
  period: "day" | "week" | "month" = "month",
): Promise<GrowthMetrics[]> {
  // This would ideally be done with a database function for better performance
  // For now, we'll return mock data structure
  // TODO: Implement proper time-series aggregation

  const metrics: GrowthMetrics[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    if (period === "day") {
      date.setDate(date.getDate() - i);
    } else if (period === "week") {
      date.setDate(date.getDate() - i * 7);
    } else {
      date.setMonth(date.getMonth() - i);
    }

    // Generate random realistic data for demo purposes
    // In production, this should be replaced with actual COUNT queries grouped by date
    metrics.push({
      date: date.toLocaleDateString("id-ID", { month: "short", day: "numeric" }),
      new_tenants: Math.floor(Math.random() * 5) + 1,
      new_users: Math.floor(Math.random() * 50) + 20 + (i * 2), // Slight upward trend
      new_courses: Math.floor(Math.random() * 10) + 5,
      new_enrollments: Math.floor(Math.random() * 100) + 50 + (i * 5), // Stronger upward trend
    });
  }

  return metrics;
}
