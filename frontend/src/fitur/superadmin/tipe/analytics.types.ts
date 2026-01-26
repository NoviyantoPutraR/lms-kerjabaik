export interface PlatformOverview {
  total_tenants: number;
  active_tenants: number;
  total_users: number;
  active_users_today: number;
  total_courses: number;
  total_enrollments: number;
  storage_used_gb: number;
}

export interface TenantAnalytics {
  id_lembaga: string;
  tenant_name: string;
  user_count: number;
  course_count: number;
  enrollment_count: number;
  active_users_30d: number;
  storage_used_mb: number;
}

export interface GrowthMetrics {
  date: string;
  new_tenants: number;
  new_users: number;
  new_courses: number;
  new_enrollments: number;
}

export interface AnalyticsFilters {
  date_from?: string;
  date_to?: string;
  id_lembaga?: string;
  period?: "day" | "week" | "month";
}
