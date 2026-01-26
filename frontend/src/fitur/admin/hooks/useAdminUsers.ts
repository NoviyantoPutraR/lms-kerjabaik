import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  bulkImportUsers,
} from "../api/usersApi";
import type { AdminUserFilters, AdminUserData } from "../tipe/admin.types";
import { useAuthStore } from "@/fitur/autentikasi/stores/authStore";

/**
 * Hook untuk query users dalam tenant admin
 * Query key includes id_lembaga untuk memastikan cache isolation per tenant
 */
export function useAdminUsers(filters?: AdminUserFilters) {
  const { user: currentUser } = useAuthStore();

  return useQuery({
    queryKey: ["admin-users", currentUser?.id_lembaga, filters],
    queryFn: () => getAdminUsers(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!currentUser?.id_lembaga, // Only run if user has id_lembaga
  });
}

/**
 * Hook untuk create user
 */
export function useCreateAdminUser() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: AdminUserData) => createAdminUser(data),
    onSuccess: () => {
      // Invalidate dengan id_lembaga untuk cache isolation
      queryClient.invalidateQueries({
        queryKey: ["admin-users", currentUser?.id_lembaga],
      });
    },
  });
}

/**
 * Hook untuk update user
 */
export function useUpdateAdminUser() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: Partial<AdminUserData>;
    }) => updateAdminUser(userId, data),
    onSuccess: () => {
      // Invalidate dengan id_lembaga untuk cache isolation
      queryClient.invalidateQueries({
        queryKey: ["admin-users", currentUser?.id_lembaga],
      });
    },
  });
}

/**
 * Hook untuk delete user
 */
export function useDeleteAdminUser() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  return useMutation({
    mutationFn: (userId: string) => deleteAdminUser(userId),
    onSuccess: () => {
      // Invalidate dengan id_lembaga untuk cache isolation
      queryClient.invalidateQueries({
        queryKey: ["admin-users", currentUser?.id_lembaga],
      });
    },
  });
}

/**
 * Hook untuk bulk import users
 */
export function useBulkImportUsers() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  return useMutation({
    mutationFn: (file: File) => bulkImportUsers(file),
    onSuccess: () => {
      // Invalidate dengan id_lembaga untuk cache isolation
      queryClient.invalidateQueries({
        queryKey: ["admin-users", currentUser?.id_lembaga],
      });
    },
  });
}
