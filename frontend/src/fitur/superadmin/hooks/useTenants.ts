import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTenants,
  getTenant,
  getTenantStats,
  createTenant,
  updateTenant,
  deleteTenant,
  checkSlugAvailability,
} from "../api/tenantsApi";
import type { TenantFilters, TenantFormData } from "../tipe/tenant.types";
import { createAuditLog } from "../api/auditLogsApi";
import { useAuthStore } from "@/fitur/autentikasi/stores/authStore";

/**
 * Hook untuk get list tenants
 */
export function useTenants(filters?: TenantFilters) {
  return useQuery({
    queryKey: ["tenants", filters],
    queryFn: () => getTenants(filters),
  });
}

/**
 * Hook untuk get single tenant
 */
export function useTenant(id: string) {
  return useQuery({
    queryKey: ["lembaga", id],
    queryFn: () => getTenant(id),
    enabled: !!id,
  });
}

/**
 * Hook untuk get tenant stats
 */
export function useTenantStats(tenantId: string) {
  return useQuery({
    queryKey: ["tenant-stats", tenantId],
    queryFn: () => getTenantStats(tenantId),
    enabled: !!tenantId,
  });
}

/**
 * Hook untuk create tenant
 */
export function useCreateTenant() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (data: TenantFormData) => createTenant(data),
    onSuccess: (newTenant) => {
      // Invalidate tenants list
      queryClient.invalidateQueries({ queryKey: ["tenants"] });

      // Log activity (non-blocking)
      if (user) {
        createAuditLog({
          id_pengguna: user.id,
          aksi: "CREATE",
          tipe_sumber_daya: "lembaga",
          id_sumber_daya: newTenant.id,
          detail: { tenant_name: newTenant.nama },
        }).catch((err) => {
          console.error("Failed to create audit log:", err);
        });
      }
    },
  });
}

/**
 * Hook untuk update tenant
 */
export function useUpdateTenant() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TenantFormData> }) =>
      updateTenant(id, data),
    onSuccess: (updatedTenant) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["lembaga", updatedTenant.id] });
      queryClient.invalidateQueries({ queryKey: ["tenant-stats", updatedTenant.id] });

      // Log activity (non-blocking)
      if (user) {
        createAuditLog({
          id_pengguna: user.id,
          aksi: "UPDATE",
          tipe_sumber_daya: "lembaga",
          id_sumber_daya: updatedTenant.id,
          detail: { tenant_name: updatedTenant.nama },
        }).catch((err) => {
          console.error("Failed to create audit log:", err);
        });
      }
    },
  });
}

/**
 * Hook untuk delete tenant
 */
export function useDeleteTenant() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (id: string) => deleteTenant(id),
    onSuccess: (_, deletedId) => {
      // Invalidate tenants list
      queryClient.invalidateQueries({ queryKey: ["tenants"] });

      // Log activity (non-blocking)
      if (user) {
        createAuditLog({
          id_pengguna: user.id,
          aksi: "DELETE",
          tipe_sumber_daya: "lembaga",
          id_sumber_daya: deletedId,
        }).catch((err) => {
          console.error("Failed to create audit log:", err);
        });
      }
    },
  });
}

/**
 * Hook untuk check slug availability
 */
export function useCheckSlug(slug: string, excludeId?: string) {
  return useQuery({
    queryKey: ["check-slug", slug, excludeId],
    queryFn: () => checkSlugAvailability(slug, excludeId),
    enabled: slug.length > 0,
    staleTime: 0, // Always fresh
  });
}
