import type { Database } from "@/shared/tipe/database.types";

type Pengguna = Database["public"]["Tables"]["pengguna"]["Row"];

/**
 * Admin dashboard statistics
 */
export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  activeLearnersToday: number;
  activeLearnersThisWeek: number;
  newUsersThisMonth: number;
}

/**
 * User filters for admin user management
 */
export interface AdminUserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

/**
 * User data untuk create/update
 */
export interface AdminUserData {
  email: string;
  password?: string; // Optional untuk update
  nama_lengkap: string;
  role: "admin" | "instruktur" | "pembelajar";
  status?: "aktif" | "nonaktif" | "suspended";
}

/**
 * Bulk import result
 */
export interface BulkImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    email: string;
    error: string;
  }>;
  createdUsers: Pengguna[];
}

/**
 * Recent user registration
 */
export interface RecentUser {
  id: string;
  nama_lengkap: string;
  email: string;
  role: string;
  created_at: string;
}

/**
 * User with pagination metadata
 */
export interface PaginatedUsers {
  data: Pengguna[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}
