import type { Database } from "@/shared/tipe/database.types";

// Base types from database
export type Tenant = Database["public"]["Tables"]["lembaga"]["Row"];
export type TenantInsert = Database["public"]["Tables"]["lembaga"]["Insert"];
export type TenantUpdate = Database["public"]["Tables"]["lembaga"]["Update"];

// Extended types for UI
export interface TenantWithStats extends Tenant {
  user_count?: number;
  course_count?: number;
  storage_used?: number;
}

export interface TenantFormData {
  nama: string;
  slug: string;
  tipe: string; // Allow custom value
  status: "aktif" | "nonaktif" | "suspended";
  url_logo?: string;
  konfigurasi?: Record<string, any>;
}

export interface TenantFilters {
  search?: string;
  status?: "aktif" | "nonaktif" | "suspended";
  tipe?: string;
  page?: number;
  limit?: number;
}

export interface TenantStats {
  total_users: number;
  active_users: number;
  total_courses: number;
  published_courses: number;
  total_enrollments: number;
  storage_used_mb: number;
}
